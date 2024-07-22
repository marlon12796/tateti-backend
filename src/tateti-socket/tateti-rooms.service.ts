import { Injectable } from "@nestjs/common";
interface Player {
	name: string;
}
interface Room {
	id: `${string}-${string}-${string}-${string}-${string}`;
	type: "public" | "private";
	players: [Player, Player];
}
@Injectable()
export class RoomService {
	private readonly rooms: Room[] = [];
	createRoom(roomType: Room["type"], clientId: string): Room {
		const roomId = this.generateRoomId();
		const newRoom: Room = {
			id: roomId,
			type: roomType,
			players: [{ name: clientId }, { name: "" }],
		};
		this.rooms.push(newRoom);
		return newRoom;
	}
	findAvailablePublicRoom() {
		const room = this.rooms.find(
			(room) =>
				room.type === "public" && (!room.players[0] || !room.players[1]),
		);
		return room ? room.id : null;
	}
	getRooms(): Room[] {
		return this.rooms;
	}
	private generateRoomId() {
		return crypto.randomUUID();
	}
}
