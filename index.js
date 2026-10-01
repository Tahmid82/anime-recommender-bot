const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = "1553867647597154394";

// How often to recommend (30 minutes)
const INTERVAL = 30 * 60 * 1000;

async function recommendAnime() {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/random/anime"
    );

    const data = await response.json();
    const anime = data.data;

    const embed = new EmbedBuilder()
      .setTitle(`🍥 ${anime.title}`)
      .setURL(anime.url)
      .setDescription(
        anime.synopsis
          ? anime.synopsis.substring(0, 1000)
          : "No description available."
      )
      .addFields(
        {
          name: "⭐ Score",
          value: anime.score ? `${anime.score}/10` : "N/A",
          inline: true
        },
        {
          name: "📺 Episodes",
          value: anime.episodes
            ? `${anime.episodes}`
            : "Unknown",
          inline: true
        },
        {
          name: "🎭 Genres",
          value:
            anime.genres?.map(g => g.name).join(", ") || "Unknown",
          inline: false
        }
      )
      .setImage(anime.images.jpg.large_image_url)
      .setFooter({
        text: "🤖 Automatic Anime Recommendation"
      });

    const channel = await client.channels.fetch(CHANNEL_ID);

    if (channel) {
      channel.send({
        content: "🍥 **ANIME RECOMMENDATION** 🍥",
        embeds: [embed]
      });
    }

  } catch (error) {
    console.error("Anime recommendation error:", error);
  }
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  recommendAnime();

  setInterval(recommendAnime, INTERVAL);
});

client.login(process.env.DISCORD_TOKEN);
