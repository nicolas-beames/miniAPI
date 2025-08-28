from flask import Flask, request, jsonify, render_template
from pathlib import Path
import csv

app = Flask(__name__)

DATA_DIR = Path("data")
DATA_FILE = DATA_DIR / "data.csv"

def ensure_data_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not DATA_FILE.exists():
        with DATA_FILE.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["texto"])  # cabeçalho

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/submit", methods=["POST"])
def submit():
    ensure_data_file()
    data = request.get_json(force=True, silent=True) or {}
    texto = str(data.get("texto") or "").strip()
    # validação mínima
    if not texto:
        return jsonify({"ok": False, "error": "Insira texto."}), 400

    # grava no CSV
    with DATA_FILE.open("a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([texto])

    return jsonify({"ok": True, "message": "Registro salvo com sucesso!"})

@app.route("/api/data", methods=["GET"])
def list_data():
    ensure_data_file()
    rows = []
    with DATA_FILE.open("r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return jsonify({"ok": True, "rows": rows})

if __name__ == "__main__":
    # debug=True só para desenvolvimento/aula
    app.run(host="127.0.0.1", port=5000, debug=True)

