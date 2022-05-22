import { useState } from 'react'

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>
}

const StatisticLine = (props) => {
  return (
    <tr><td>{props.text}</td><td>{props.value}</td></tr>
  )
}

const Statistics = (props) => {

  const calculateAverage = (good, bad, neutral) => {
    const total = good + bad + neutral  // total votes
    return ((good * 1) + (bad * (-1)) + (neutral * 0)) / total
  }

  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <>
        <p>No feedbad given</p>
      </>
    )
  } else {
    return (
      <>
        <table>
          <tbody>
            <StatisticLine text="good" value={props.good}/>
            <StatisticLine text="neutral" value={props.neutral}/>
            <StatisticLine text="bad" value={props.bad}/>
            <StatisticLine text="all" value={props.good + props.neutral + props.bad}/>
            <StatisticLine text="average" value={calculateAverage(props.good, props.bad, props.neutral)}/>
            <StatisticLine text="positive" value={`${props.good / (props.good + props.neutral + props.bad) * 100} %`}/>
          </tbody>
        </table>
      </>
    )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h3>Give feedback</h3>
      <Button onClick={() => setGood(good + 1)} text="good"/>
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button onClick={() => setBad(bad + 1)} text="bad"/>
      <h3>Statistics</h3>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App