import git
import re
import json
from . import *


def scan_file(file_path):
    with get_file(file_path, 'r') as f:
        lines = f.readlines()
    return extract_doc_and_command(lines)

def extract_doc_and_command(lines):
    results = []
    doc_comment = []
    capturing_doc = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Start of doc comment
        if stripped.startswith("/**"):
            capturing_doc = True
            doc_comment = [stripped.lstrip("/**").strip()]
            continue

        # Capture lines inside comment
        if capturing_doc:
            if "*/" in stripped:
                capturing_doc = False
                doc_comment.append(stripped.split("*/")[0].strip())
            else:
                doc_comment.append(stripped.strip("* ").strip())
            continue

        # Command match
        match = re.match(r"Cypress\.Commands\.add\(\s*['\"](\w+)['\"]\s*,\s*(?:\{[^\}]*\},)?\s*\(?([^)]*)\)?\s*=>", stripped)
        if match:
            name = match.group(1)
            params = [p.strip() for p in match.group(2).split(",") if p.strip()]
            results.append({
                "name": name,
                "params": params,
                "doc": " ".join(doc_comment).strip()
            })
            doc_comment = []  # Reset for next command

    return results

def format_ts_comment(description):
    lines = description.split('\n')
    return '\n    /**\n    ' + '\n    '.join([f"* {line.strip()}" for line in lines if line.strip()]) + '\n    */'

def generate_types(json_path, output_path="index.d.ts"):
    with get_file(json_path, "r") as f:
        commands = json.load(f)

    ts_lines = ["// Auto-generated Cypress command types\n",
                "declare namespace Cypress {\n",
                "  interface Chainable {\n"]

    for command in commands:
        comment = format_ts_comment(command["doc"])
        params = command["params"]

        # Format param list
        param_signature = ", ".join([f"{param}" for param in params])
        ts_lines.append(f"    {comment}")
        # Chainable<IArguments, ...> repeated per param
        if command["params"]:
            chain_args = ", ".join(["IArguments"] * len(command["params"]))
            ts_lines.append(f"    {command['name']}({param_signature}): Chainable<{chain_args}>;")
        else:
            ts_lines.append(f"    {command['name']}(): Chainable<void>;")
        ts_lines.append("")  # blank line

    ts_lines.append("  }\n}")
    
    with save(BASE_DIR/output_path) as f:
        f.write("\n".join(ts_lines))

def compare_changes(current_commands):
    previous_commands = []
    with get_file(DEFAULT_OUTPUT_FILE) as previous_custom_commands:
        previous_commands = json.load(previous_custom_commands)
    
    # Convert lists to dictionaries for easier lookup by 'name'
    old_commands_map = {cmd['name']: cmd for cmd in previous_commands}
    new_commands_map = {cmd['name']: cmd for cmd in current_commands}

    new_commands = []
    updated_commands = []
    deleted_commands = []

    # Check for new and updated commands
    for new_cmd_name, new_cmd_details in new_commands_map.items():
        if new_cmd_name not in old_commands_map:
            new_commands.append(new_cmd_details)
        else:
            old_cmd_details = old_commands_map[new_cmd_name]
            # Compare 'params' and 'doc' fields
            # Using sorted lists for params comparison to handle order changes if any
            # For 'params', we'll compare the lists directly for exact match,
            # or you can sort them if order doesn't matter.
            # Here, we'll assume order matters for 'params' array.
            params_changed = new_cmd_details.get('params') != old_cmd_details.get('params')
            doc_changed = new_cmd_details.get('doc') != old_cmd_details.get('doc')

            if params_changed or doc_changed:
                updated_commands.append({
                    "name": new_cmd_name,
                    "old_params": old_cmd_details.get('params'),
                    "new_params": new_cmd_details.get('params'),
                    "old_doc": old_cmd_details.get('doc'),
                    "new_doc": new_cmd_details.get('doc')
                })

    # Check for deleted commands
    for old_cmd_name, old_cmd_details in old_commands_map.items():
        if old_cmd_name not in new_commands_map:
            deleted_commands.append(old_cmd_details)

    return {
        "new_commands": new_commands,
        "updated_commands": updated_commands,
        "deleted_commands": deleted_commands
    }

if __name__ == "__main__":
    local_resource = open_default()

    all_custom_commands = scan_file(f"{BASE_DIR}/cypress/support/commands.js")
    changes = compare_changes(all_custom_commands)
    save_default(all_custom_commands)
    generate_types("commands.json", output_path="cypress/support/index.d.ts") 

    newly_added_commands = ", ".join([f"{command["name"]}" for command in changes["new_commands"]])
    updated_commands = ", ".join([f"{command["name"]}" for command in changes["updated_commands"]])
    deleted_commands = ", ".join([f"{command["name"]}" for command in changes["deleted_commands"]])
    
    repo = git.Repo(local_resource["REPO_PATH"])
    repo.index.add([f"{BASE_DIR.absolute()}/cypress/support/commands.js"])
    repo.index.commit(f"[BUILD-AUTO-COMMIT] Added new custom commands : {newly_added_commands}; Updated commands : {updated_commands}; Deleted Commands : {deleted_commands}")
    repo.index.add([f"{BASE_DIR.absolute()}/cypress/support/index.d.ts"])
    repo.index.commit(f"[BUILD-AUTO-COMMIT] Auto generated TypeScript file for commands : {newly_added_commands},{updated_commands},{deleted_commands} to help in auto completion")
