import json
from pathlib import Path


BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'Resources'
DEFAULT_FILE = "strings.json"
DEFAULT_OUTPUT_FILE = "commands.json"


def get_file(filename, mode='r'):
    file_path = DATA_DIR / filename
    return file_path.open(mode)

def save_file(filename):
    file_path = DATA_DIR / filename
    return file_path.open('w')

def open_default():
    with get_file(DEFAULT_FILE) as local_resources:
        return json.load(local_resources)
    
def save_default(data):
    try:
        with get_file(DEFAULT_OUTPUT_FILE, 'w') as json_file:
            json_file.write(json.dumps(data, indent=4))
    except IOError as e:
        print(f"Error while writing to file : {e}")
