import './ComponentStyles.css'

export default function Slogan() {

  return (
<>
      <div className="slogan-container">
        <div className="slogan-static-part">
          <h1>BETTER</h1>
        </div>
        <div className="slogan-dynamic-word-stack">
          <h1 className="swap-word word-1">POOLS</h1>
          <h1 className="swap-word word-2">TOGETHER</h1>
          <h1 className="swap-word word-3">STATE</h1>
        </div>
      </div>
      </>
  )};