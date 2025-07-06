from flask import Flask, jsonify, request

app = Flask(__name__)

# Game data storage (in-memory for simplicity)
game_data = {
    "saves": {},
    "leaderboard": []
}

@app.route('/save_game', methods=['POST'])
def save_game():
    data = request.json
    user_id = data.get('user_id')
    game_state = data.get('game_state')
    
    if not user_id or not game_state:
        return jsonify({"error": "Invalid request"}), 400
    
    game_data['saves'][user_id] = game_state
    return jsonify({"message": "Game saved successfully"})

@app.route('/load_game', methods=['GET'])
def load_game():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    game_state = game_data['saves'].get(user_id)
    
    if game_state is None:
        return jsonify({"error": "No saved game found"}), 404
    
    return jsonify(game_state)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    user_id = data.get('user_id')
    score = data.get('score')
    time_taken = data.get('time_taken')
    
    if not all([user_id, score, time_taken]):
        return jsonify({"error": "Invalid request"}), 400
    
    game_data['leaderboard'].append({
        "user_id": user_id,
        "score": score,
        "time_taken": time_taken
    })
    
    # Sort leaderboard by score (descending) and time (ascending)
    game_data['leaderboard'].sort(key=lambda x: (-x['score'], x['time_taken']))
    
    return jsonify({"message": "Score submitted successfully"})

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    return jsonify(game_data['leaderboard'])

if __name__ == '__main__':
    app.run(debug=True)