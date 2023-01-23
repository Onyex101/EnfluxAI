from src import create_app
# "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security  --user-data-dir=~/chromeTemp
app = create_app()

if __name__ == '__main__':
    app.run()