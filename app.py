from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os
from dateutil import parser


app = Flask(__name__)


startingTime = ""
config = 'dataFP.json'


@app.route('/')
def index():
    try:
        with open(config, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    return render_template('times.html', data=data)


@app.route('/command', methods=['GET', 'POST'])
def command():
    if request.method == 'POST':
        data = request.form
        save_data(data)        
        with open(config, 'r') as f:
            data = json.load(f)
        return render_template('command.html', data=data)
    else:
        try:
            with open(config, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {}  # If the file does not exist, create an empty dictionary
        return render_template('command.html', data=data)


@app.route('/data', methods=['GET'])
def get_data():
    with open(config, 'r') as f:
        data = json.load(f)
    return jsonify(data)


@app.route('/data-last-modified', methods=['GET'])
def data_last_modified():
    try:
        modification_time = os.path.getmtime(config)
        return jsonify({'lastModified': modification_time})
    except OSError:
        return jsonify({'lastModified': None})

@app.route('/scripts/<path:filename>')
def scripts(filename):
    return send_from_directory('scripts', filename)

@app.route('/fonts/<path:filename>')
def custom_font_route(filename):
    return send_from_directory('static/fonts', filename, mimetype='font/ttf')


def format_datetime(datetime_str):
    if not datetime_str:
        return ""  # or return a default value, or handle the error as needed
    #print(datetime_str)
    dt = parser.parse(str(datetime_str))
    formatted_dt = dt.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'  

    return formatted_dt

def save_data(form_data):
    #keep episode structure
    with open(config, 'r') as f:
        data = json.load(f)

    structured_data = {"episode_order": data["episode_order"]}
    
    #print(form_data)
    # Iterate over the form data
    for key in form_data:
        #print (key)
        if (key == "startTime"):
            structured_data["start_time"] = format_datetime(form_data[key])
            continue
        key_parts = key.split('_')
        team, ep_num, entry_type = key_parts[0], key_parts[1], key_parts[2]
        #print(team, ep_num, entry_type)
        
        if team not in structured_data:
            structured_data[team] = {}

        if ep_num not in structured_data[team]:           
            structured_data[team][ep_num] = {'runner': '', 'end_time': ''}      

        if entry_type == 'runner':
            structured_data[team][ep_num]['runner'] = form_data[key]
        elif entry_type == 'endtime':                    
            structured_data[team][ep_num]['end_time'] = format_datetime(form_data[key])

    
    with open(config, 'w') as f:
        json.dump(structured_data, f, indent=4)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=35065)
