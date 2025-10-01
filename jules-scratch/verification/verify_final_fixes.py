from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for all console events and print them to the terminal
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))

        try:
            # 1. Start the game
            page.goto("http://localhost:8000")

            # Wait for the modal to be visible
            expect(page.locator("#selection-modal")).to_be_visible(timeout=10000)

            # 2. Select faction and role
            page.select_option("#faction-select", "blue")
            page.select_option("#role-select", "protecteur") # Player is a protector

            # 3. Click start button
            page.click("button[type='submit']")

            # Wait for the modal to disappear
            expect(page.locator("#selection-modal")).not_to_be_visible(timeout=5000)

            # 4. Let the game run to observe AI behavior
            # Wait for 20 seconds to give mobs time to engage and shoot
            page.wait_for_timeout(20000)

            # 5. Take a screenshot
            screenshot_path = "jules-scratch/verification/final_fix_verification.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()