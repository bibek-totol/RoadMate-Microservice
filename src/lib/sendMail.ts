import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, html: string) => {
    const cleanEmail = (process.env.EMAIL || "").trim();
    // Google App Passwords are shown with spaces (e.g. "abcd efgh ijkl mnop"), but Gmail SMTP requires 16 chars without spaces
    const cleanPass = (process.env.PASS || "").replace(/\s+/g, "");

    if (!cleanEmail || !cleanPass) {
        throw new Error("Missing EMAIL or PASS environment variable for SMTP configuration.");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: cleanEmail,
            pass: cleanPass,
        },
    });

    await transporter.sendMail({
        from: `"RoadMate" <${cleanEmail}>`,
        to,
        subject,
        html,
    });
};