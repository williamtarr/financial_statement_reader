import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import pandas as pd

# Set your OpenAI API key

def get_excel_files(root_folder):
    """
    Recursively collects all Excel files in the given root folder.
    """
    excel_files = []
    for root, dirs, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".xlsx") or file.endswith(".xls"):
                excel_files.append(os.path.join(root, file))
    return excel_files

def read_excel_file(file_path):
    """
    Reads an Excel file into a CSV-formatted string.
    """
    try:
        df = pd.read_excel(file_path)
        # Convert the DataFrame to CSV text. This helps preserve the table's structure.
        csv_data = df.to_csv(index=False)
        return csv_data
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None

def call_openai_api(prompt, max_tokens=4096):
    """
    Calls the OpenAI ChatCompletion API with the given prompt and returns the response text.
    """
    try:
        response = client.chat.completions.create(model="gpt-4o-mini",  # or another model like gpt-4
        messages=[
            {"role": "system", "content": "You are an expert data parser."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max_tokens,
        temperature=0.2,
        n=1)
        # The response text is now in response.choices[0].message.content
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None

def parse_excel_content_with_openai(csv_content):
    """
    Generates a prompt for OpenAI to parse the CSV content, identifying headers, data rows,
    and flagging rows that appear to be totals or subtotals.
    """
    prompt = (
        "You are an expert data parser. Given the following CSV-formatted content extracted from an Excel file, "
        "analyze the table structure and identify the headers, data rows, and any rows that represent totals or subtotals. "
        "Return the parsed data in a structured JSON format with keys for 'headers', 'data', and 'totals'.\n\n"
        f"CSV Content:\n{csv_content}\n\n"
        "Please parse and provide the output."
    )
    return call_openai_api(prompt)

def main():
    # Replace with the path to your folder containing Excel files
    root_folder = "statements"
    excel_files = get_excel_files(root_folder)

    if not excel_files:
        print("No Excel files found in the specified folder.")
        return

    for file_path in excel_files:
        print(f"Processing file: {file_path}")
        csv_content = read_excel_file(file_path)
        if csv_content:
            result = parse_excel_content_with_openai(csv_content)
            if result:
                print("OpenAI Parsed Result:")
                print(result)
            else:
                print("Failed to parse content with OpenAI.")
        else:
            print("Failed to read the Excel file.")

if __name__ == "__main__":
    main()
