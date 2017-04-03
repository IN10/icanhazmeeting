# I can haz meeting?

## Installation
1. Create a OAuth2 client ID on the [Google API Manager](https://console.developers.google.com). Choose "Web Application" as the Application type and add [localhost:8080](http://localhost:8080) to the Authorised Javascript origins.
1. Copy `config.example.js` to `config.js` and fill in details as required.
1. Serve the main folder using a web server on [localhost:8080](http://localhost:8080). If you have PHP available on the terminal, you can accomplish this by running the following command in this folder:
    ```bash
    php -S localhost:8080
    ```

## Usage
Open [localhost:8080](http://localhost:8080) in a browser. Confirm the modal window and login with your Google Account that has (atleast) read-level access on the resources you want to track. The UI will automatically refresh every 30 seconds.

## Development
[Jakob Buis](http://www.jakobbuis.nl)
