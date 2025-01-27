from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

# In-memory storage for simplicity
active_users = []
chat_rooms = {}

@app.route("/fetch-pair", methods=["POST"])
def fetch_pair():
    global active_users, chat_rooms

    # Simulate a user ID (this should be retrieved from session or auth in real use)
    user_id = str(uuid.uuid4())

    active_users.append(user_id)

    if len(active_users) >= 2:
        user1 = active_users.pop(0)
        user2 = active_users.pop(0)
        chat_room_id = str(uuid.uuid4())  # Unique chat room ID
        chat_rooms[chat_room_id] = [user1, user2]
        return jsonify({"user1": user1, "user2": user2, "chatRoomId": chat_room_id})

    return jsonify({"message": "Waiting for another user."}), 200

if __name__ == "__main__":
    app.run(debug=True)