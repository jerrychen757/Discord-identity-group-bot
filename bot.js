const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// 定義身份組
const roleNames = ["身份組1", "身份組2", "身份組3", "身份組4"]; // 依據所需添加身份組

// 觸發
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // 指定頻道
    const channelId = '頻道ID'; 
    const channel = client.channels.cache.get(channelId);

    // When找不到頻道，回傳錯誤訊息
    if (!channel) {
        console.error("找不到指定頻道!");
        return;
    }

    // 創建按鈕
    const row = new ActionRowBuilder();

    roleNames.forEach(roleName => {
        const button = new ButtonBuilder()
            .setCustomId(roleName) // 身份組名稱作為按鈕名
            .setLabel(` ${roleName} `)
            .setStyle(ButtonStyle.Success); 
        row.addComponents(button);
    });

    // 發送消息＆按鈕組
    await channel.send({
        content: "請點擊下方按鈕來領取身分！",
        components: [row]
    });
});

// 按鈕交互
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    // 獲取身份
    const roleName = interaction.customId;
    // 查找身份
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    // If找無身份，回傳錯誤消息
    if (!role) {
        await interaction.reply({ content: `找不到名為 ${roleName} 的身分！`, ephemeral: true });
        return;
    }

    // 檢查是否擁有此身份（有則移除，無則給與）
    const member = interaction.member;
    if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        await interaction.reply({ content: `你已成功移除 ${roleName} 的身分！`, ephemeral: true });
    } else {
        await member.roles.add(role);
        await interaction.reply({ content: `你已成功獲得 ${roleName} 的身分！`, ephemeral: true });
    }
});
client.login('替換為機器人token');
