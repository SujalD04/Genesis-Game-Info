import axios from "axios";
import ValorantModel from "../models/Valorant";

export const fetchValorantContent = async () => {
  try {
    // Fetch data from Valorant API (No API key required)
    const mapsRes = await axios.get("https://valorant-api.com/v1/maps");
    const agentsRes = await axios.get("https://valorant-api.com/v1/agents");
    const skinsRes = await axios.get("https://valorant-api.com/v1/weapons/skins");
    const spraysRes = await axios.get("https://valorant-api.com/v1/sprays");
    const charmsRes = await axios.get("https://valorant-api.com/v1/buddies");
    const playerCardsRes = await axios.get("https://valorant-api.com/v1/playercards");
    const gameModesRes = await axios.get("https://valorant-api.com/v1/gamemodes");

    const formattedData = {
      maps: mapsRes.data.data.map((map: any) => ({
        id: map.uuid,
        name: map.displayName,
        image: map.splash, // High-quality splash image
        minimap: map.displayIcon, // Minimap version
      })) || [],

      characters: agentsRes.data.data
    .filter((agent: any) => agent.isPlayableCharacter) // ✅ Removes duplicate Sova
    .map((agent: any) => ({
        id: agent.uuid,
        name: agent.displayName,
        portrait: agent.fullPortrait,
        background: agent.background,
    })) || [],


      skins: skinsRes.data.data.map((skin: any) => ({
        id: skin.uuid,
        name: skin.displayName,
        image: skin.displayIcon, // Skin image
      })) || [],

      sprays: spraysRes.data.data.map((spray: any) => ({
        id: spray.uuid,
        name: spray.displayName,
        image: spray.fullTransparentIcon, // Transparent spray image
      })) || [],

      charms: charmsRes.data.data.map((charm: any) => ({
        id: charm.uuid,
        name: charm.displayName,
        image: charm.displayIcon, // Weapon buddy image
      })) || [],

      playerCards: playerCardsRes.data.data.map((card: any) => ({
        id: card.uuid,
        name: card.displayName,
        image: card.largeArt, // Full-size card artwork
      })) || [],

      gameModes: gameModesRes.data.data.map((mode: any) => ({
        id: mode.uuid,
        name: mode.displayName,
        image: mode.displayIcon, // Game mode icon
      })) || [],
    };

    await ValorantModel.findOneAndUpdate({}, formattedData, { upsert: true, new: true });
    return formattedData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching Valorant API: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching Valorant API.");
  }
};
