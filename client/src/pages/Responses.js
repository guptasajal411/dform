import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import domain from "../common/api";

export default function Responses() {
    const params = useParams();
    const [errorMessage, setErrorMessage] = useState();
    const [formTitle, setFormTitle] = useState();
    const [formDescription, setFormDescription] = useState("");
    const [formViews, setFormViews] = useState();
    const [formQuestions, setFormQuestions] = useState([]);

    useEffect(() => {
        async function responses() {
            await fetch(domain + "/api/responses/" + params.formSlug, {
                headers: { "x-access-token": localStorage.getItem("token") },
                method: "GET"
            })
                .then(response => response.json())
                .then((jsonData) => {
                    if (jsonData.status === "ok") {
                        setFormTitle(jsonData.form.formTitle);
                        setFormDescription(jsonData.form.formDescription);
                        jsonData.form.formQuestions.map((question) => {
                            if (question.type === "text") {
                                question.answer = [""];
                            } else {
                                question.answer = [{}];
                                question.options.map((option, optionIndex) => {
                                    question.answer[0][optionIndex] = false;
                                });
                            }
                        });
                        setFormQuestions(jsonData.form.formQuestions);
                        setFormViews(jsonData.form.formViews);
                    } else {
                        setErrorMessage(jsonData.message);
                    }
                });
        }
        responses();
    }, []);

    return (
        <div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {formTitle && formDescription && formViews &&
                <form>
                    <h1>{formTitle}</h1>
                    <p>{formDescription}</p>
                    <p>Form views: {formViews}</p>
                    {formQuestions.map((question, index) => (
                        <div key={`${question}-${index}`} style={{ border: "1px solid red", marginBottom: "10px", width: "fit-content", padding: "20px 10px" }}>
                            <h3 style={{ margin: "0" }}>{index + 1}. {question.question}</h3>
                            <br />
                            <h4 style={{ margin: "0" }}>{question.description}</h4>
                            <br />
                            {question.type === "text" &&
                                <div>
                                    {question.answers.map((singleAnswer, singleAnswerIndex) => (
                                        <div>
                                            <p>{singleAnswerIndex + 1}. {singleAnswer}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                            {question.type !== "text" &&
                                <div>
                                    <table>
                                        <tr>
                                            <td>Sr.</td>
                                            {question.options.map((option) => (
                                                <td>{option}</td>
                                            ))}
                                        </tr>
                                    </table>
                                    {question.answers.map((singleAnswer, singleAnswerIndex) => (
                                        <tr>
                                            <td>{singleAnswerIndex + 1}. </td>
                                            {singleAnswer.map((singleAnswerBool) => (
                                                <td>{singleAnswerBool ? <p>✅</p> : <p>❎</p>}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </div>
                            }
                        </div>
                    ))}
                </form>
            }
        </div>
    )
}
