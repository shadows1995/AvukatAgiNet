import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
setGlobalOptions({ region: "us-central1" }); // gerekiyorsa bölgeyi değiştir

export const makeInitialAdmin = onRequest(async (req, res) => {
  try {
    const secret = req.query.secret;
    if (secret !== "setup_admin_123") {
      res.status(403).send("forbidden");
      return;
    }

    const email = "vahdetbicak@gmail.com";
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    res.status(200).send(`✅ ${email} is now admin`);
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error?.message ?? "error");
  }
});
