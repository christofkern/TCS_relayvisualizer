from flask import Flask, render_template, request, redirect, url_for, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    try:
        with open('data_new.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    return render_template('times.html', data=data)


@app.route('/command', methods=['GET', 'POST'])
def command():
    if request.method == 'POST':
        data = request.form
        save_data(data)
        return redirect(url_for('index'))
    else:
        try:
            with open('data.json', 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {}  # If the file does not exist, create an empty dictionary
        return render_template('command.html', data=data)


@app.route('/data', methods=['GET'])
def get_data():
    with open('data.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

def save_data(form_data):
    # Initialize an empty dictionary to hold structured data
    structured_data = {f'team{num}': {} for num in range(1, 4)}  # Adjust range for the number of teams
    print(form_data)
    # Iterate over the form data
    for key in form_data:
        # Split the key to extract team number, type (runner/time), and episode number

        print (key)
        key_parts = key.split('_')
        team_num, entry_type, ep_num = key_parts[0][4:], key_parts[1][:-1], key_parts[1][-1]

        # Check if the episode entry already exists, if not create it
        if f'E{ep_num}' not in structured_data[f'team{team_num}']:
            structured_data[f'team{team_num}'][f'E{ep_num}'] = {'runner': '', 'time': '--:--'}

        # Update the runner or time based on entry type
        if entry_type == 'runner':
            structured_data[f'team{team_num}'][f'E{ep_num}']['runner'] = form_data[key]
        elif entry_type == 'time':
            structured_data[f'team{team_num}'][f'E{ep_num}']['time'] = form_data[key]

    # Write the structured data to 'data.json' file
    with open('data_new.json', 'w') as f:
        json.dump(structured_data, f, indent=4)

if __name__ == '__main__':
    app.run(debug=True)
