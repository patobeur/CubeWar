import os
from playwright.sync_api import sync_playwright, Page, expect

def verify(page: Page):
    # Get the absolute path of the index.html file
    file_path = os.path.abspath('index.html')
    # Use 'file://' protocol to open the local file
    page.goto(f'file://{file_path}')

    # Wait for 1 second to allow all game scripts to load and execute
    page.wait_for_timeout(1000)

    # Wait for the footer to be visible
    footer = page.locator("#footer")
    expect(footer).to_be_visible()

    # Wait for the nav to be visible
    nav = page.locator("#top-nav")
    expect(nav).to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify(page)
        browser.close()

if __name__ == "__main__":
    main()