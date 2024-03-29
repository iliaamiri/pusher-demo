import Head from "next/head";
import React, {useEffect} from "react";
import styles from "../styles/Home.module.css";
import Pusher from "pusher-js";
import axios from "axios";
import {ResponsePayload} from "../models/responsePayload.dto";

export default function Home({}) {
    const [messages, setMessages] = React.useState([]);
    const [message, setMessage] = React.useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        console.log("send", message);

        setMessage("");

        try {
            const res = await axios.post<ResponsePayload>("/api/push", {message});
            console.log("response from server: ", res.data);
        } catch (e) {
            console.log(e);
        }
    }

    const clearChatHandler = async () => {
        setMessages([]);
    };

    useEffect(() => {
        const pusher = new Pusher('fab43cbed41df87fe85a', {
            cluster: 'us3',
            forceTLS: false
        });

        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function (data) {
            setMessages((messages) => [...messages, data.message]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.unbind_all();
            pusher.disconnect();
        }
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Pusher 🤡</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Pusher demo
                </h1>

                <div className={styles.center}>
                    <input type="text" className={styles.sexyInput} placeholder="Say something" value={message}
                           onChange={(e) => setMessage(e.target.value)}/>
                    <button onClick={handleSend} className={styles.sexyButton}>Send</button>
                    <br/>
                    <button className={styles.button} onClick={clearChatHandler}>Clear 🤡's sayings</button>
                </div>

                <div>
                    {
                        messages.reverse().map((message, index) => (
                            <p key={index}>🤡 <b>said</b>: {message}</p>
                        ))
                    }
                </div>
            </main>
        </div>
    );
}
