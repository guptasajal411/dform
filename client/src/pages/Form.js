import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Form() {
    const params = useParams();
    const [errorMessage, setErrorMessage] = useState();
    const [formTitle, setFormTitle] = useState();
    const [formDescription, setFormDescription] = useState("");
    const [formViews, setFormViews] = useState();
    const [formQuestions, setFormQuestions] = useState([]);

    useEffect(() => {
        async function dashboard() {
            await fetch("http://localhost:3001/api/form/" + params.formSlug, {
                method: "GET"
            })
                .then(response => response.json())
                .then((jsonData) => {
                    if (jsonData.status === "ok") {
                        setFormTitle(jsonData.form.formTitle);
                        setFormDescription(jsonData.form.formDescription);
                        jsonData.form.formQuestions.map((question) => {
                            if (question.type === "text"){
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
        dashboard();
    }, []);

    async function handleSubmit(event){
        event.preventDefault();
        await fetch("http://localhost:3001/api/form/" + params.formSlug, {
            headers: { 'Content-Type': 'application/json '},
            body: JSON.stringify(formQuestions),
            method: "POST"
        });
    }

    function handleTextAnswerChange(index, event){
        const questions = [...formQuestions];
        questions[index].answer[0] = event.target.value;
        setFormQuestions(questions);
    }

    function handleMcqAnswerChange(index, optionIndex, event){
        const questions = [...formQuestions];
        const optionNumber = optionIndex.toString();
        questions[index].answer[0][optionNumber] = event.target.checked;
        setFormQuestions(questions);
    }

    function handleScqAnswerChange(index, optionIndex, event){
        const questions = [...formQuestions];
        questions[index].options.map((option, optionIndex) => {
            questions[index].answer[0][optionIndex] = false;
        });
        questions[index].answer[0][optionIndex] = event.target.checked;
        setFormQuestions(questions);
    }

    return (
        <div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            { formTitle && formDescription && formViews && 
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
                    <button type="submit">Submit</button>
                </form>
            }
        </div>
    )
}
