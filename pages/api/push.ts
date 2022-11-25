import {NextApiRequest, NextApiResponse} from "next";
import Pusher from "pusher";
import {ResponsePayload} from "../../models/responsePayload.dto";

const pusher = new Pusher({
    appId: "1513459",
    key: "fab43cbed41df87fe85a",
    secret: "9291d692cd9e17b15544",
    cluster: "us3",
    useTLS: false
});

export default async (req: NextApiRequest, res: NextApiResponse<ResponsePayload>) => {
    const {message} = req.body;

    const responsePayload: ResponsePayload = {message};

    await pusher.trigger("my-channel", "my-event", responsePayload);
    res.status(200).json(responsePayload);
};
