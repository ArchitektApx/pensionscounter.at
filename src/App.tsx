import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { calculateRetirementDate, calculateTimeLeft, TimeLeft } from './helpers';

function App() {
  const [dob, setDob] = useState<string>('');
  const [retirementDate, setRetirementDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [remember, setRemember] = useState<boolean>(false);

  /**
   * Initializes the app by checking if a date of birth is stored in localStorage.
   * If a stored date is found and is valid, initializes the countdown.
   */
  useEffect(() => {
    const storedDOB = localStorage.getItem("storedDOB");
    if (storedDOB) {
      setDob(storedDOB);
      const birthDate = new Date(storedDOB);
      if (!isNaN(birthDate.getTime())) {
        const retireDate = calculateRetirementDate(birthDate);
        setRetirementDate(retireDate);
        setTimeLeft(calculateTimeLeft(retireDate));
        setRemember(true);
      }
    }
  }, []);

  // Update countdown timer every second when a valid retirement date is set.
  useEffect(() => {
    if (!retirementDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(retirementDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [retirementDate]);

  /**
   * Handles the date input change event. Parses the entered date,
   * calculates the retirement date, optionally stores the date if "remember" is checked,
   * and initializes the countdown.
   *
   * @param e - The change event object from the date input.
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDob(input);
    const birthDate = new Date(input);
    if (isNaN(birthDate.getTime())) {
      setRetirementDate(null);
      setTimeLeft(null);
      localStorage.removeItem("storedDOB");
      return;
    }
    const retireDate = calculateRetirementDate(birthDate);
    setRetirementDate(retireDate);
    setTimeLeft(calculateTimeLeft(retireDate));

    // Store or remove the date in localStorage based on the remember flag.
    if (remember) {
      localStorage.setItem("storedDOB", input);
    } else {
      localStorage.removeItem("storedDOB");
    }
  };

  /**
   * Handles the change for the "remember date" checkbox.
   *
   * @param e - The change event object from the checkbox.
   */
  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRemember(isChecked);
    if (isChecked && dob) {
      localStorage.setItem("storedDOB", dob);
    } else {
      localStorage.removeItem("storedDOB");
    }
  };

  /**
   * Clears the stored date and resets the relevant states.
   */
  const handleClearDate = () => {
    localStorage.removeItem("storedDOB");
    setDob('');
    setRetirementDate(null);
    setTimeLeft(null);
    setRemember(false);
  };

  return (
    <Container fluid className="hero">
      <Row className="justify-content-center">
        <Col xs={12} className="d-flex justify-content-center">
          <Card className="p-4 shadow card-bg">
            <Card.Title className="mb-3 text-center">
              Pensions Countdown
            </Card.Title>
            <Form>
              <Form.Group controlId="dob">
                <Form.Label>Geburtsdatum</Form.Label>
                <Form.Control
                  type="date"
                  value={dob}
                  onChange={handleDateChange}
                />
              </Form.Group>
              <Form.Group controlId="rememberDate" className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Geburtsdatum merken"
                  checked={remember}
                  onChange={handleRememberChange}
                />
              </Form.Group>
              {dob && (
                <Form.Group className="mt-2">
                  <Button variant="secondary" onClick={handleClearDate}>
                    Datum löschen
                  </Button>
                </Form.Group>
              )}
            </Form>
            {retirementDate && timeLeft && (
              <div className="mt-4 text-center counter-container">
                <h5>
                  Pensionsdatum: {retirementDate.toLocaleDateString()}
                </h5>
                <div className="d-flex justify-content-around mt-3">
                  <div className="time-segment">
                    <h2>{timeLeft.days}</h2>
                    <p>Tage</p>
                  </div>
                  <div className="time-segment">
                    <h2>{timeLeft.hours}</h2>
                    <p>Stunden</p>
                  </div>
                  <div className="time-segment">
                    <h2>{timeLeft.minutes}</h2>
                    <p>Minuten</p>
                  </div>
                  <div className="time-segment">
                    <h2>{timeLeft.seconds}</h2>
                    <p>Sekunden</p>
                  </div>
                </div>
              </div>
            )}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="info-tooltip">
                  Alle Daten werden ausschließlich in Ihrem Browser gespeichert und lokal berechnet. Es werden keine Daten über das Internet übertragen. Das Pensionsdatum wird gemäß österreichischer Regelung berechnet: Erster Tag des Monats nach dem 65. Geburtstag.
                </Tooltip>
              }
            >
              <Button variant="outline-info" size="sm" className="info-btn">
                Info
              </Button>
            </OverlayTrigger>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
