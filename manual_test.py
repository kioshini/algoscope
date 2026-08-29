import pathlib
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

ROOT = pathlib.Path(__file__).parent / "test-results"
ROOT.mkdir(exist_ok=True)
APP = "http://127.0.0.1:5198/"

console_errors = []
failed_requests = []

with sync_playwright() as pw:
    browser = pw.chromium.launch(
        headless=True,
        executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    )
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("requestfailed", lambda r: failed_requests.append(f"FAILED {r.url}: {r.failure}"))

    page.goto(APP, wait_until="domcontentloaded")
    page.locator(".runtime-state[data-ready='true']").wait_for(timeout=40000)
    print("[1] runtime loaded")

    page.get_by_role("button", name="Library").click()
    page.locator(".library-view").wait_for(timeout=30000)
    assert page.locator(".algorithm-index > .algorithm-list-row").count() == 80, "library rows != 80"
    print("[2] library shows 80 algorithms")

    # Search + open favorite toggle
    page.get_by_placeholder("Search by name, family, or property").fill("heap")
    page.locator(".algorithm-index .favorite-toggle").first.click()
    assert page.locator(".algorithm-index .favorite-toggle.active").count() >= 1
    page.get_by_title("Clear search").click()
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child", has_text="Selection Sort").click()
    print("[3] search + favorite toggle OK")
    page.screenshot(path=ROOT / "manual-1-library.png", full_page=True)

    # Command palette
    page.keyboard.press("Control+k")
    page.locator(".command-palette").wait_for()
    page.locator(".command-input input").fill("quick")
    page.locator(".command-list > button", has_text="Quick Sort").first.click()
    page.get_by_role("button", name="My Lab").wait_for()
    page.locator(".code-panel").wait_for()
    print("[4] palette jumped to Quick Sort editor")
    page.screenshot(path=ROOT / "manual-2-palette.png", full_page=True)
    page.get_by_role("button", name="Library").click()
    page.locator(".library-view").wait_for()

    # Benchmarks - run
    page.get_by_role("button", name="Benchmarks").click()
    page.locator(".benchmark-view").wait_for()
    page.get_by_role("button", name="Run benchmark").click()
    page.locator(".benchmark-row:not(.benchmark-header)").nth(2).wait_for(timeout=60000)
    assert page.locator(".benchmark-row:not(.benchmark-header)").count() >= 3
    print("[5] benchmark ran")
    page.screenshot(path=ROOT / "manual-3-benchmark.png", full_page=True)

    # Export CSV (download event)
    try:
        with page.expect_download(timeout=10000) as dl:
            page.get_by_role("button", name="Export CSV").click()
        print("[6] CSV download:", dl.value.suggested_filename)
    except Exception as exc:
        print("[6] CSV download skipped:", exc)

    # Growth
    page.get_by_role("button", name="Library").click()
    page.get_by_role("button", name="Analyze").click()
    page.get_by_text("Observed growth").wait_for(timeout=120000)
    page.get_by_role("button", name="Analyze").wait_for(timeout=120000)
    assert page.locator(".complexity-insight").count() >= 1
    print("[7] growth + insight rendered")
    page.screenshot(path=ROOT / "manual-4-growth.png", full_page=True)

    # Structures
    page.get_by_role("button", name="Structures").click()
    page.locator(".structures-view").wait_for()
    page.locator(".structure-tabs button", has_text="Graph").click()
    page.locator(".graph-canvas").wait_for()
    page.get_by_role("button", name="Run BFS").click()
    page.locator(".event-stream > button").nth(3).wait_for(timeout=30000)
    print("[8] structures BFS OK")
    page.screenshot(path=ROOT / "manual-5-structures.png", full_page=True)

    # Russian
    page.get_by_role("button", name="Library").click()
    page.locator(".library-view").wait_for()
    page.locator(".locale-button").click()
    page.get_by_role("button", name="Библиотека").wait_for()
    page.screenshot(path=ROOT / "manual-6-ru.png", full_page=True)
    print("[9] Russian locale OK")

    browser.close()

    filtered = [e for e in console_errors if "favicon" not in e.lower()]
    if filtered:
        print("CONSOLE ERRORS:")
        for e in filtered:
            print("  -", e)
    if failed_requests:
        print("FAILED REQUESTS:")
        for r in failed_requests:
            print("  -", r)
    if not filtered and not failed_requests:
        print("No console errors / failed requests")
    print("WALKTHROUGH DONE")
