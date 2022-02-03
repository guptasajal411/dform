import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import domain from "../common/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/Responses.css";
import "./css/Fonts.css";


export default function Responses() {
    const navigate = useNavigate();
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
            <div className="section1 d-flex align-items-center justify-content-center">
                <div className="responsesPage p-4 shadow-lg">
                    {errorMessage &&
                        <div className="d-flex align-items-center justify-content-center flex-column mt-4">
                            <h5 className="text-center mb-4" style={{ color: "#ed4245" }}>{errorMessage}</h5>
                            <button onClick={() => { navigate("/dashboard") }} className="errorButton white py-2 px-3">Return to your Dashboard</button>
                        </div>
                    }
                    {formTitle && formDescription && formViews && !errorMessage &&
                        <div>
                            <h3 className="text-start white mt-2">{formTitle}</h3>
                            <p className="text-start white2 mt-3">{formDescription}</p>
                            <hr className="formRule" />
                        </div>
                    }
                    {formQuestions.map((question, index) => (
                        <div key={`${question}-${index}`} className="formQuestion my-4">
                            <h5 className="question mb-2 white">{question.question}</h5>
                            <p className="responseLabel white2 m-0">{question.description}</p>
                            {question.type === "text" &&
                                <div className="white responsesBox px-3 my-2 py-2">
                                    {question.answers.map((singleAnswer, singleAnswerIndex) => (
                                        <div>
                                            <p className="m-0 textResponse">{singleAnswerIndex + 1}. {singleAnswer}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                            {question.type === "scq" &&
                                <div className="white responsesBox px-3 my-2 py-2">
                                    {
                                        question.answers.map((singleAnswerArray, singleAnswerIndexArray) => (
                                            <div>
                                                {singleAnswerArray.map((singleAnswer, singleAnswerIndex) => (
                                                    <div>
                                                        {singleAnswer === true && <p className="m-0">{singleAnswerIndexArray + 1}. {question.options[singleAnswerIndex]}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            {question.type === "mcq" &&
                                <div className="white responsesBox px-3 my-2 py-2">
                                    {
                                        question.answers.map((singleAnswerArray, singleAnswerIndexArray) => (
                                            <div>
                                                <p className="m-0">{singleAnswerIndexArray + 1}.&nbsp;
                                                    {singleAnswerArray.map((singleAnswer, singleAnswerIndex) => (
                                                        <>
                                                            {singleAnswer === true && <>{question.options[singleAnswerIndex]} | </>}
                                                            {/* {singleAnswer === true && singleAnswerIndex !== singleAnswerArray.length - 1 && <>{question.options[singleAnswerIndex]}</> } */}
                                                            {/* {singleAnswer === true && singleAnswerIndex === singleAnswerArray.length - 1 && <>{question.options[singleAnswerIndex]}</> } */}
                                                        </>
                                                    ))}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
