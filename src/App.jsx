import { useState } from 'react';
import { GradeForm } from "./gradeForm";
import { Results } from "./results";
import "./styles.css";

export default function App() {
    const [showResults, setShowResults] = useState(false);
    const [calculatedResults, setCalculatedResults] = useState([]);

    const handleFormSubmit = (results) => {
        setCalculatedResults(results);
        setShowResults(true);
    };

    return (
        <>
            <p className="siteTitle">ELECTRICAL ENGINEERING DEPARTMENT</p>
            {!showResults ? (
                <GradeForm onSubmit={handleFormSubmit} />
            ) : (
                <Results results={calculatedResults} />
            )}
        </>
    );
}
