import React, { useEffect, useState } from 'react'

export default function New() {
    const [errorMessage, setErrorMessage] = useState();
    const [username, setUsername] = useState();
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
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
                await fetch("http://localhost:3001/api/new", {
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

    function handleSubmit() {
        const postData = {
            formAuthorUsername: username,
            formTitle,
            formDescription,
            formQuestions: form
        }

        console.log(postData);
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
        questions[index].options=[""];
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
                                <button onClick={index => handleQuestionRemoval(index)}>Remove this question</button>
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
                                    <button onClick={() => { handleAddOption(index) }}>Add new option</button>
                                </div>
                            }
                        </div>
                    ))}
                    <button onClick={() => { handleAddQuestion() }}>
                        Add a new question
                    </button>
                    <button onClick={handleSubmit}>
                        Create form
                    </button>
                </div>
            }
        </div>
    )
}