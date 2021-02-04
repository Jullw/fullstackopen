import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Statistics = ({good, neutral, bad}) => {

  const sum = good + neutral + bad
  const averageNum = (good + (bad - (bad * 2))) / sum
  const positiveFeed = good * 100 / sum

  if(sum === 0){
    return(
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
      <table>
      <StatisticLine text={'good'} value={good} />
      <StatisticLine text={'neutral'} value={neutral} />
      <StatisticLine text={'bad'} value={bad} />
      <StatisticLine text={'all'} value={sum} />
      <StatisticLine text={'average'} value={averageNum} />
      <StatisticLine text={'positive'} value={positiveFeed} />
      </table>
  )
}

const StatisticLine = ({text, value}) =>{
  return(
      <tbody>
        <tr>
          <td>{text} {value}</td>
        </tr>
      </tbody>
  )
}

const Button = ({handleClick, text}) => <button onClick={handleClick}> {text} </button>



const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return(
    <div> 
      <h1> give feedback </h1>
      <Button handleClick={()=> setGood(good + 1)} text={'good'}/>
      <Button handleClick={()=> setNeutral(neutral + 1)} text={'neutral'}/>
      <Button handleClick={()=> setBad(bad + 1)} text={'bad'}/>
      <h1> statistics </h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}




ReactDOM.render(<App />, document.getElementById('root'))