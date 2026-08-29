/// <reference lib="webworker" />

import { loadPyodide } from 'pyodide';
import tracerSource from '../python/tracer.py?raw';
import type { WorkerRequest, WorkerResponse } from '../types';

declare const self: DedicatedWorkerGlobalScope;

const indexURL = import.meta.env.DEV
  ? new URL('/pyodide/', self.location.origin).href
  : new URL('../pyodide/', self.location.href).href;

const runtimePromise = loadPyodide({ indexURL })
  .then((runtime) => {
    runtime.runPython(tracerSource);
    self.postMessage({ id: 'startup', type: 'ready', version: runtime.version } satisfies WorkerResponse);
    return runtime;
  })
  .catch((cause) => {
    const error = cause instanceof Error ? cause : new Error(String(cause));
    self.postMessage({
      id: 'startup',
      type: 'error',
      name: error.name,
      message: error.message,
    } satisfies WorkerResponse);
    throw error;
  });

self.onmessage = async (message: MessageEvent<WorkerRequest>) => {
  const request = message.data;
  try {
    const runtime = await runtimePromise;
    runtime.globals.set('__algoscope_request', JSON.stringify(request));
    try {
      const commands: Record<WorkerRequest['type'], string> = {
        trace: '__algoscope_trace(__algoscope_request)',
        analyze: '__algoscope_analyze(__algoscope_request)',
        measure: '__algoscope_measure(__algoscope_request)',
        execute: '__algoscope_execute(__algoscope_request)',
        'visualize-lab': '__algoscope_visualize_lab(__algoscope_request)',
      };
      const command = commands[request.type];
      const rawResponse = runtime.runPython(command);
      if (typeof rawResponse !== 'string') throw new Error('Python returned an invalid response.');
      self.postMessage({ id: request.id, ...JSON.parse(rawResponse) } as WorkerResponse);
    } finally {
      runtime.globals.delete('__algoscope_request');
    }
  } catch (cause) {
    const error = cause instanceof Error ? cause : new Error(String(cause));
    self.postMessage({
      id: request.id,
      type: 'error',
      name: error.name,
      message: cleanPythonError(error.message),
    } satisfies WorkerResponse);
  }
};

function cleanPythonError(message: string) {
  const lines = message.split('\n').filter((line) => !line.includes('pyodide.asm'));
  return lines.slice(-8).join('\n').trim() || 'Python execution failed.';
}

export {};
