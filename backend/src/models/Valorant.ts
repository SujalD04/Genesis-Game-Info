import mongoose, { Schema, Document } from "mongoose";

interface IValorantContent extends Document {
  maps: { id: string; name: string; image?: string; minimap?: string }[];
  characters: { id: string; name: string; portrait?: string; background?: string }[];
  skins: { id: string; name: string; image?: string }[];
  sprays: { id: string; name: string; image?: string }[];
  charms: { id: string; name: string; image?: string }[];
  playerCards: { id: string; name: string; image?: string }[];
  gameModes: { id: string; name: string; image?: string }[];
}

const ValorantSchema = new Schema<IValorantContent>({
  maps: [{ id: String, name: String, image: String, minimap: String }],
  characters: [{ id: String, name: String, portrait: String, background: String }],
  skins: [{ id: String, name: String, image: String }],
  sprays: [{ id: String, name: String, image: String }],
  charms: [{ id: String, name: String, image: String }],
  playerCards: [{ id: String, name: String, image: String }],
  gameModes: [{ id: String, name: String, image: String }],
}, {
  collection: "valorant",
});

export default mongoose.model<IValorantContent>("Valorant", ValorantSchema);
