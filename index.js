const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = "1553867647597154394";

// 30 minutes
const INTERVAL = 30 * 60 * 1000;

async function recommendAnime() {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/random/anime"
    );

    const data = await response.json();
    const anime = data.data;

    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setTitle(`🍥 ${anime.title}`)
      .setDescription(
        anime.synopsis
          ? anime.synopsis.substring(0, 700)
          : "No synopsis available."
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
            : "N/A",
          inline: true
        },
        {
          name: "🎭 Type",
          value: anime.type || "N/A",
          inline: true
        }
      )
      .setImage(anime.images.jpg.large_image_url)
      .setURL(anime.url)
      .setFooter({
        text: "🍥 Anime Recommendation System"
      });

    await channel.send({
      content: "✨ **New Anime Recommendation!**",
      embeds: [embed]
    });

    console.log(`Recommended: ${anime.title}`);
  } catch (error) {
    console.error("Recommendation error:", error);
  }
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Send first recommendation after the bot starts
  recommendAnime();

  // Then every 30 minutes
  setInterval(recommendAnime, INTERVAL);
});

client.login(process.env.DISCORD_TOKEN);
