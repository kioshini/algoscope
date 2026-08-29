from pathlib import Path
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError, sync_playwright


ROOT = Path(__file__).parents[1]
SCREENSHOTS = ROOT / "test-results"
APP_URL = "http://127.0.0.1:5199"
SCREENSHOTS.mkdir(exist_ok=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        headless=True,
        executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    )
    page = browser.new_page(viewport={"width": 1440, "height": 960}, device_scale_factor=1)
    console_errors = []
    failed_requests = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: failed_requests.append(f"FAILED {request.url}: {request.failure}"))
    page.on("response", lambda response: failed_requests.append(f"HTTP {response.status} {response.url}") if response.status >= 400 else None)
    page.add_init_script("localStorage.removeItem('algoscope:locale')")
    page.goto(APP_URL, wait_until="domcontentloaded")
    try:
        page.locator(".runtime-state[data-ready='true']").wait_for(timeout=30_000)
    except PlaywrightTimeoutError:
        page.screenshot(path=SCREENSHOTS / "runtime-error.png", full_page=True)
        print(f"Console errors before runtime timeout: {console_errors}")
        print(f"Failed requests before runtime timeout: {failed_requests}")
        raise

    page.get_by_role("button", name="Library").click()
    page.locator(".library-view").wait_for(timeout=30_000)
    assert page.locator(".algorithm-index > .algorithm-list-row > button:first-child").count() == 80
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child").filter(has=page.get_by_text("Natural Merge Sort", exact=True)).click()
    page.get_by_role("button", name="Visualize").click()
    page.get_by_role("button", name="Run", exact=True).click()
    page.get_by_text("Correct output").wait_for(timeout=30_000)
    page.get_by_role("button", name="Library").click()
    page.locator(".library-view").wait_for(timeout=30_000)
    page.locator(".library-lab-links > button", has_text="Breadth-First Search").click()
    page.locator(".graph-canvas").wait_for(timeout=30_000)
    assert page.locator(".mode-tabs button.active").inner_text() == "Structures"
    page.locator(".structure-tabs button", has_text="Stack").click()
    page.locator(".lab-value-control input").fill("12")
    page.locator(".operation-list button", has_text="Push").click()
    assert page.locator(".stack-items .top span").inner_text() == "12"
    page.locator(".structure-tabs button", has_text="Min Heap").click()
    page.locator(".lab-value-control input").fill("0")
    page.locator(".operation-list button", has_text="Insert").click()
    page.locator(".event-stream > button").last.click()
    assert page.locator(".heap-array > div").first.locator("span").inner_text() == "0"
    page.locator(".structure-tabs button", has_text="Graph").click()
    page.get_by_role("button", name="Run BFS").click()
    assert page.locator(".event-stream > button").count() > 5
    page.get_by_role("button", name="Run Dijkstra").click()
    page.locator(".event-stream > button").last.click()
    assert "DISTANCES" in page.locator(".lab-state-summary").inner_text().upper()
    edge_count = page.locator(".graph-edge-list > div").count()
    page.get_by_role("button", name="Delete edge A to B").click()
    assert page.locator(".graph-edge-list > div").count() == edge_count - 1
    page.get_by_role("button", name="Undo", exact=True).click()
    assert page.locator(".graph-edge-list > div").count() == edge_count
    page.locator(".structure-tabs button", has_text="Stack").click()
    page.get_by_role("button", name="Python", exact=True).click()
    page.get_by_role("button", name="Run Python").click()
    page.get_by_role("button", name="Run Python").wait_for(timeout=30_000)
    page.locator(".event-stream > button").nth(4).wait_for(timeout=30_000)
    page.locator(".event-stream > button").last.click()
    assert page.locator(".stack-items .top span").inner_text() == "5"
    assert "LINE" in page.locator(".lab-code-column .panel-heading").inner_text().upper()
    page.locator(".structure-tabs button", has_text="Graph").click()
    page.get_by_role("button", name="Run Python").click()
    page.get_by_role("button", name="Run Python").wait_for(timeout=30_000)
    page.locator(".event-stream > button").last.wait_for(timeout=30_000)
    page.locator(".event-stream > button").last.click()
    assert page.locator(".lab-state-summary strong").inner_text() == "7"
    page.screenshot(path=SCREENSHOTS / "structures.png", full_page=True)
    page.get_by_role("button", name="Library").click()
    page.locator(".library-view").wait_for()
    page.locator(".locale-button").click()
    page.get_by_role("button", name="\u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430").wait_for()
    page.locator(".locale-button").click()
    page.get_by_role("button", name="Library").wait_for()
    page.get_by_placeholder("Search by name, family, or property").fill("Knuth-Morris-Pratt")
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child").filter(has=page.get_by_text("Knuth-Morris-Pratt", exact=True)).click()
    page.get_by_role("button", name="Run example").click()
    page.locator(".catalog-demo-output pre").get_by_text("10", exact=True).wait_for(timeout=30_000)
    assert "10" in page.locator(".catalog-demo-output pre").inner_text()
    page.locator(".catalog-demo-output em.diff-match").wait_for()
    page.get_by_role("tab", name="C++").click()
    page.locator(".language-source-panel").get_by_text("Implementation C++").wait_for()
    assert "kmpSearch" in page.locator(".language-source-panel pre").inner_text()
    page.screenshot(path=SCREENSHOTS / "catalog-demo.png", full_page=True)
    page.get_by_title("Clear search").click()
    page.get_by_placeholder("Search by name, family, or property").fill("heap")
    assert page.locator(".algorithm-index > .algorithm-list-row > button:first-child").count() >= 1
    page.get_by_title("Clear search").click()
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child", has_text="Selection Sort").click()
    page.locator(".algorithm-detail .favorite-toggle.detail").click()
    page.locator(".algorithm-index .favorite-toggle.active").wait_for()
    assert page.locator(".algorithm-index .favorite-toggle.active").count() >= 1
    page.keyboard.press("Control+k")
    page.locator(".command-palette").wait_for()
    page.locator(".command-input input").fill("knuth")
    page.locator(".command-list-row > button:first-child").first.click()
    assert page.locator(".command-palette").count() == 0
    page.keyboard.press("Shift+/")
    page.locator(".shortcuts-panel").wait_for()
    page.keyboard.press("Escape")
    page.locator(".shortcuts-panel").wait_for(state="detached")
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child", has_text="Selection Sort").click()
    page.screenshot(path=SCREENSHOTS / "library.png", full_page=True)
    page.get_by_title("Toggle theme").click()
    page.screenshot(path=SCREENSHOTS / "library-light.png", full_page=True)
    page.get_by_title("Toggle theme").click()
    page.get_by_role("button", name="Visualize").click()
    page.get_by_text("01 / Selection Sort").wait_for(timeout=30_000)
    page.get_by_role("button", name="My code").click()
    page.get_by_text("01 / Your draft").wait_for(timeout=30_000)

    page.keyboard.press("Control+Enter")
    page.get_by_text("Correct output").wait_for(timeout=30_000)
    page.get_by_title("Tools and accessibility").click()
    page.get_by_text("Recent runs").wait_for()
    page.get_by_role("button", name="Challenge me").click()
    page.locator(".challenge-card").wait_for()
    page.locator(".challenge-card").get_by_role("button", name="Close").click()
    page.locator("#algorithm-input").fill("9, 1, 3")
    page.get_by_role("button", name="Result outdated · Run again").wait_for()
    assert page.evaluate("location.hash").startswith("#/trace")
    assert page.locator(".bar").count() == 8
    assert page.locator(".timeline").get_attribute("max") != "0"

    page.get_by_role("button", name="Library").click()
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child").filter(has=page.get_by_text("Quick Sort", exact=True)).click()
    page.get_by_role("button", name="Add to benchmark").click()
    assert page.locator(".mode-tabs button.active").inner_text() == "Benchmarks"
    page.get_by_role("button", name="Run benchmark").click()
    page.locator(".benchmark-row:not(.benchmark-header)").nth(3).wait_for(timeout=60_000)
    assert page.locator(".benchmark-row:not(.benchmark-header)").count() >= 4
    assert "QUICK SORT" in page.locator(".benchmark-table").inner_text().upper()
    page.screenshot(path=SCREENSHOTS / "benchmark.png", full_page=True)

    page.get_by_role("button", name="Library").click()
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child").filter(has=page.get_by_text("Counting Sort", exact=True)).click()
    page.get_by_role("button", name="Add to benchmark").click()
    assert page.locator(".benchmark-selection > span").count() == 2
    assert "COUNTING SORT" in page.locator(".benchmark-selection").inner_text().upper()
    assert "RADIX" in page.locator(".benchmark-selection").inner_text().upper()
    page.get_by_role("button", name="Run benchmark").click()
    page.locator(".benchmark-row:not(.benchmark-header)").nth(1).wait_for(timeout=60_000)
    assert page.locator(".benchmark-row:not(.benchmark-header)").count() == 2

    page.get_by_role("button", name="Library").click()
    page.locator(".algorithm-index > .algorithm-list-row > button:first-child").filter(has=page.get_by_text("Merge Sort", exact=True)).click()
    page.get_by_role("button", name="Analyze").click()
    page.get_by_text("Observed growth").wait_for(timeout=120_000)
    page.get_by_role("button", name="Analyze").wait_for(timeout=120_000)
    page.screenshot(path=SCREENSHOTS / "desktop.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile.goto(APP_URL, wait_until="domcontentloaded")
    mobile.locator(".runtime-state[data-ready='true']").wait_for(state="attached", timeout=120_000)
    mobile.get_by_role("button", name="My Lab", exact=True).click()
    mobile.get_by_role("navigation", name="Mobile workspace").get_by_role("button", name="Code").click()
    mobile.locator(".code-panel").wait_for(timeout=30_000)
    mobile.get_by_role("navigation", name="Mobile workspace").get_by_role("button", name="Visual").click()
    mobile.locator(".visualization-panel").wait_for()
    mobile.get_by_role("navigation", name="Mobile workspace").get_by_role("button", name="Metrics").click()
    mobile.locator(".metrics-panel").wait_for()
    mobile.screenshot(path=SCREENSHOTS / "mobile-workspace.png", full_page=True)
    mobile.get_by_role("navigation", name="Mobile workspace").get_by_role("button", name="Code").click()
    mobile.get_by_role("button", name="Run", exact=True).click()
    mobile.get_by_role("button", name="Run", exact=True).wait_for(timeout=30_000)
    assert mobile.get_by_role("navigation", name="Mobile workspace").get_by_role("button", name="Visual").get_attribute("aria-pressed") == "true"
    mobile.locator(".visualization-panel").wait_for()
    mobile.get_by_role("button", name="Library").click()
    mobile.locator(".algorithm-index > .algorithm-list-row > button:first-child").filter(has=mobile.get_by_text("Merge Sort", exact=True)).click()
    mobile.locator(".library-view.show-detail .algorithm-detail").wait_for()
    assert mobile.get_by_role("button", name="Library", exact=True).count() >= 1
    mobile.screenshot(path=SCREENSHOTS / "mobile.png", full_page=True)
    mobile.get_by_role("button", name="Structures").click()
    mobile.locator(".structure-tabs button", has_text="Graph").click()
    mobile.locator(".graph-canvas").wait_for()
    mobile.get_by_role("navigation", name="Mobile structure workspace").get_by_role("button", name="Controls").click()
    mobile.get_by_role("button", name="Run BFS").click()
    assert mobile.get_by_role("navigation", name="Mobile structure workspace").get_by_role("button", name="Visual").get_attribute("aria-pressed") == "true"
    mobile.locator(".graph-canvas").wait_for()
    mobile.screenshot(path=SCREENSHOTS / "mobile-structures.png", full_page=True)
    mobile.get_by_role("button", name="Python", exact=True).click()
    mobile.get_by_role("navigation", name="Mobile structure workspace").get_by_role("button", name="Code").wait_for()
    mobile.locator(".lab-code-column").wait_for()
    mobile.get_by_role("button", name="Run Python").click()
    mobile.get_by_role("button", name="Run Python").wait_for(timeout=30_000)
    assert mobile.get_by_role("navigation", name="Mobile structure workspace").get_by_role("button", name="Visual").get_attribute("aria-pressed") == "true"
    mobile.locator(".graph-canvas").wait_for()
    mobile.get_by_role("navigation", name="Mobile structure workspace").get_by_role("button", name="Events").click()
    mobile.locator(".event-stream > button").last.click()
    assert mobile.locator(".lab-state-summary strong").inner_text() == "7"
    mobile.screenshot(path=SCREENSHOTS / "mobile-structures-python.png", full_page=True)

    short = browser.new_page(viewport={"width": 1366, "height": 600}, device_scale_factor=1)
    short.goto(APP_URL, wait_until="domcontentloaded")
    short.locator(".runtime-state[data-ready='true']").wait_for(timeout=30_000)
    short_modes = [
        ("Library", ".library-view"),
        ("Benchmarks", ".benchmark-view"),
        ("Growth", ".complexity-view"),
        ("My Lab", ".visualization-panel"),
        ("Structures", ".structures-view"),
    ]
    for mode, selector in short_modes:
        short.get_by_role("button", name=mode, exact=True).click()
        short.locator(selector).wait_for(timeout=30_000)
        dimensions = short.evaluate("""() => ({
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pageWidth: document.documentElement.scrollWidth,
            pageHeight: document.documentElement.scrollHeight,
        })""")
        assert dimensions["pageWidth"] <= dimensions["viewportWidth"], (mode, dimensions)
        assert dimensions["pageHeight"] <= dimensions["viewportHeight"] + 1, (mode, dimensions)
    short.screenshot(path=SCREENSHOTS / "short-desktop.png", full_page=True)
    short.set_viewport_size({"width": 821, "height": 600})
    for mode, selector in short_modes:
        short.get_by_role("button", name=mode, exact=True).click()
        short.locator(selector).wait_for(timeout=30_000)
        dimensions = short.evaluate("""() => ({
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pageWidth: document.documentElement.scrollWidth,
            pageHeight: document.documentElement.scrollHeight,
        })""")
        assert dimensions["pageWidth"] <= dimensions["viewportWidth"], (mode, dimensions)
        if mode != "Library":
            assert dimensions["pageHeight"] <= dimensions["viewportHeight"] + 1, (mode, dimensions)
    short.screenshot(path=SCREENSHOTS / "narrow-short-desktop.png", full_page=True)

    landscape = browser.new_page(viewport={"width": 900, "height": 420}, device_scale_factor=1)
    landscape.goto(APP_URL, wait_until="domcontentloaded")
    landscape.locator(".runtime-state[data-ready='true']").wait_for(state="attached", timeout=30_000)
    landscape.get_by_role("button", name="Structures", exact=True).click()
    landscape.locator(".structures-view").wait_for(timeout=30_000)
    landscape_size = landscape.evaluate("""() => ({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pageWidth: document.documentElement.scrollWidth,
        pageHeight: document.documentElement.scrollHeight,
    })""")
    assert landscape_size["pageWidth"] <= landscape_size["viewportWidth"]
    assert landscape_size["pageHeight"] > landscape_size["viewportHeight"]
    landscape.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    timeline_box = landscape.locator(".lab-timeline").bounding_box()
    assert timeline_box and timeline_box["y"] < landscape_size["viewportHeight"]
    landscape.screenshot(path=SCREENSHOTS / "short-landscape.png", full_page=True)

    browser.close()

    filtered = [error for error in console_errors if "favicon" not in error.lower()]
    if filtered:
        raise AssertionError(f"Browser console errors: {filtered}")

    print("Browser smoke test passed: library, trace, compare, complexity, structures, responsive shell")

