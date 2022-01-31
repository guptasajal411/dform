import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import domain from "../common/api";

export default function Form() {
    const params = useParams();
    const [errorMessage, setErrorMessage] = useState();
    const [formTitle, setFormTitle] = useState();
    const [formDescription, setFormDescription] = useState("");
    const [formViews, setFormViews] = useState();
    const [formQuestions, setFormQuestions] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);
    const [submitMessage, setSubmitMessage] = useState();

    useEffect(() => {
        async function dashboard() {
            await fetch(domain + "/api/form/" + params.formSlug, {
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
                                question.answer = [];
                                question.options.map((option, optionIndex) => {
                                    question.answer[optionIndex] = false;
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
        dashboard();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch(domain + "/api/form/" + params.formSlug, {
            headers: { 'Content-Type': 'application/json ' },
            body: JSON.stringify(formQuestions),
            method: "POST"
        })
            .then(response => response.json())
            .then(response => {
                setIsFetching(false);
                setSubmitMessage(response.message);
                if (response.status === "ok") {
                    setError(false);
                } else {
                    setError(true);
                }
            });
    }

    function handleTextAnswerChange(index, event) {
        const questions = [...formQuestions];
        questions[index].answer[0] = event.target.value;
        setFormQuestions(questions);
    }

    function handleMcqAnswerChange(index, optionIndex, event) {
        const questions = [...formQuestions];
        questions[index].answer[optionIndex] = event.target.checked;
        setFormQuestions(questions);
    }

    function handleScqAnswerChange(index, optionIndex, event) {
        const questions = [...formQuestions];
        questions[index].options.map((option, optionIndex) => {
            questions[index].answer[optionIndex] = false;
        });
        questions[index].answer[optionIndex] = event.target.checked;
        setFormQuestions(questions);
    }

    return (
        <div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {formTitle && formDescription && formViews &&
                <form onSubmit={event => handleSubmit(event)}>
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
                                <input
                                    type="text"
                                    placeholder="Type your answer..."
                                    value={question.answer[0]}
                                    onChange={(event) => { handleTextAnswerChange(index, event) }}
                                />
                            }
                            {question.type === "mcq" &&
                                <div>
                                    {question.options.map((singleOption, optionIndex) => (
                                        <div>
                                            <input
                                                type="checkbox"
                                                value={singleOption}
                                                onChange={(event) => { handleMcqAnswerChange(index, optionIndex, event) }}
                                                id={index + "." + optionIndex}
                                            />
                                            <label for={index + "." + optionIndex}>{singleOption}</label>
                                        </div>
                                    ))}
                                </div>
                            }
                            {question.type === "scq" &&
                                <div>
                                    {question.options.map((singleOption, optionIndex) => (
                                        <div>
                                            <input
                                                type="radio"
                                                value={singleOption}
                                                id={index + "." + optionIndex}
                                                onChange={(event) => { handleScqAnswerChange(index, optionIndex, event) }}
                                                name={index}
                                            />
                                            <label for={index + "." + optionIndex}>{singleOption}</label>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    ))}
                    <button type="submit" disabled={isFetching}>
                        {isFetching ? "Submitting..." : "Submit"}
                    </button>
                    <p style={{ color: error ? 'rgb(237, 66, 69)' : "green" }}>
                        {submitMessage}
                    </p>
                </form>
            }
        </div>
    )
}
