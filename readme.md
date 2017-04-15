# I can haz meeting?

> Free-busy dashboard for meeting rooms

## Local installation
1. Create a OAuth2 client ID on the [Google API Manager](https://console.developers.google.com). Choose "Web Application" as the Application type and add [localhost:8080](http://localhost:8080) to the Authorised Javascript origins.
1. Copy `src/config.example.js` to `src/config.js` and fill in details as required. The `rows` property is a two-dimensional array to enable display into rows: use a maximum of 4 entries per sub-array.
1. Install the dependencies
    ```bash
    npm install
    ```
1. Serve the main folder using a web server on [localhost:8080](http://localhost:8080).
    ```bash
    npm run dev
    ```

## Usage
Open [localhost:8080](http://localhost:8080) in a browser. Confirm the modal window and login with your Google Account. The UI will automatically refresh on a timer.

## Development
[Jakob Buis](http://www.jakobbuis.nl)
