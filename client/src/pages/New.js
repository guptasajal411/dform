import React, { useEffect, useState } from 'react';
import domain from "../common/api";

export default function New() {
    const [errorMessage, setErrorMessage] = useState();
    const [username, setUsername] = useState();
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [postFormError, setPostFormError] = useState();
    const [postFormIsError, setPostFormIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [form, setForm] = useState(
        [
            {
                question: null,
                description: null,
                type: "text",
            }
        ]
    );

    useEffect(() => {
        async function dashboard() {
            if (localStorage.getItem("token")) {
                await fetch(domain + "/api/new", {
                    headers: { "x-access-token": localStorage.getItem("token") },
                    method: "GET"
                })
                    .then(response => response.json())
                    .then((jsonData) => {
                        console.log(jsonData);
                        if (jsonData.status === "ok") {
                            setUsername(jsonData.username);
                        } else {
                            setErrorMessage(jsonData.message);
                        }
                    });
            } else {
                // token not available
                setErrorMessage("JWT not available. Please try logging in first.");
            }
        }
        dashboard();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsFetching(true);
        window.scrollTo(0, 0);
        await fetch(domain + "/api/new", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                formAuthorUsername: username,
                formTitle,
                formDescription,
                formQuestions: form
            }),
            method: "POST"
        })
            .then(response => response.json())
            .then(jsonData => {
                setPostFormError(jsonData.message);
                if (jsonData.status === "ok") {
                    setPostFormIsError(false);
                    setIsFetching(false);
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 800);
                } else {
                    setPostFormIsError(true);
                    setIsFetching(false);
                }
            })
            .catch(error => postFormError(error));
    }

    function handleAddQuestion() {
        const questions = [...form];
        questions.push(
            {
                question: null,
                description: null,
                type: "text",
                options: [""]
            }
        );
        setForm(questions);
    }

    function handleQuestionRemoval(index) {
        const questions = [...form];
        questions.splice(index, 1);
        setForm(questions);
        // return true;
    }

    function handleQuestionChange(index, event) {
        const questions = [...form];
        questions[index].question = event.target.value;
        setForm(questions);
    }

    function handleDescriptionChange(index, event) {
        const questions = [...form];
        questions[index].description = event.target.value;
        setForm(questions);
    }

    function handleTypeChange(index, event) {
        const questions = [...form];
        questions[index].options = [""];
        questions[index].type = event.target.value;
        setForm(questions);
    }

    function handleOptionChange(index, optionIndex, event) {
        const questions = [...form];
        questions[index].options[optionIndex] = event.target.value;
        setForm(questions);
    }

    function handleAddOption(index) {
        const questions = [...form];
        questions[index].options.push("");
        setForm(questions);
    }
    return (
        <div>
            {username ? <h1>Welcome, {username}</h1> : <h1>Welcome</h1>}
            <hr />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {<p style={{ color: setPostFormIsError ? "red" : "green" }}>{postFormError}</p>}
            {!errorMessage &&
                <div>
                    <h1>Create a new form:</h1>
                    <label>Form title: </label>
                    <input
                        type="text"
                        value={formTitle}
                        onChange={event => setFormTitle(event.target.value)}
                    />
                    <label>Form description: </label>
                    <input
                        type="text"
                        value={formDescription}
                        onChange={event => setFormDescription(event.target.value)}
                    />
                    <br />
                    {form.map((question, index) => (
                        <div key={`${question}-${index}`} style={{ border: "1px solid red", marginBottom: "10px", width: "fit-content", padding: "20px 10px" }}>
                            <div>
                                <p>Question {index + 1}</p>
                                <button onClick={index => handleQuestionRemoval(index)} disabled={isFetching}>Remove this question</button>
                            </div>
                            <label>Question: </label>
                            <input
                                type="text"
                                value={question.question || ""}
                                onChange={event => handleQuestionChange(index, event)}
                            />
                            <br />
                            <label>Description: </label>
                            <input
                                type="text"
                                value={question.description || ""}
                                onChange={event => handleDescriptionChange(index, event)}
                            />
                            <br />
                            <label>Type: </label>
                            <select value={question.type} onChange={event => handleTypeChange(index, event)}>
                                <option value="text">Text answer</option>
                                <option value="mcq">Multiple choice answer</option>
                                <option value="scq">Single choice answer</option>
                            </select>
                            <br />
                            {question.type !== "text" &&
                                <div>
                                    {question.options.map((singleOption, optionIndex) => (
                                        <div>
                                            <label>Option {optionIndex + 1}: </label>
                                            <input
                                                type="text"
                                                value={singleOption}
                                                onChange={event => handleOptionChange(index, optionIndex, event)}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={() => { handleAddOption(index) }} disabled={isFetching}>Add new option</button>
                                </div>
                            }
                        </div>
                    ))}
                    <button onClick={() => { handleAddQuestion() }} disabled={isFetching}>
                        Add a new question
                    </button>
                    <button onClick={handleSubmit} disabled={isFetching}>
                        {isFetching ? <p style={{margin: "0"}}>Creating your form...</p> : <p style={{margin: "0"}}>Create form</p>}
                    </button>
                </div>
            }
        </div>
    )
}