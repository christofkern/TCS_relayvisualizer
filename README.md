
# Python Flask Web Application for Tracking Speedrun Times

This web application, built using Flask, is specifically designed to track individual speedrunner times in a Lego Star Wars - The Complete Saga Relay Race. It offers a simple interface for displaying and updating speedrun times stored in JSON format.

## Features

- **Data Display**: Shows current speedrun times from a JSON file.
- **Data Update**: Allows users to update speedrun times via a web form and save these changes.
- **Fetch Last Modified Time**: Displays the last modified timestamp of the speedrun data file.

## Installation

Ensure you have Python and Flask installed to run this application. You can install Flask using the following command:

```
pip install Flask
```

## Running the Application

Follow these steps to get the application running:

1. Download the application files to your local machine and navigate to the app's directory.
2. Start the server with:
   ```
   python app.py
   ```
3. Access the application through `http://127.0.0.1:5000/` in your web browser.

## Application Endpoints

- `/`: Main page that loads and displays data from \`data.json\`.
- `/command`: Handles data updates via POST and displays current data via GET.
- `/data`: Provides current data in JSON format via GET.
- `/data-last-modified`: Returns the timestamp of the last data modification via GET.

## Usage

This application is ideal for event organizers and participants in Lego Star Wars - The Complete Saga Relay Races to monitor and update the times of various runners. It simplifies the management of speedrunner times, making the race easier to track and analyze.

## Contributing

Contributions are welcome! Feel free to fork this repository, make changes, and submit pull requests. You can also raise issues for any bugs found or features suggested.

## License

This project is open-sourced under the MIT License - see the License [License] for details.
