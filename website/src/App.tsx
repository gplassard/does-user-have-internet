import './App.css'
import data from './assets/data/data.json';

function App() {
    return (
        <>
            <h1>Does $user have internet ?</h1>
            <div className="card">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Internet Status</th>
                        <th>Since</th>
                    </tr>

                    </thead>
                    <tbody>
                    {Object.entries(data.users).map(([username, userData]) => {
                        return (
                            <tr>
                                <td>{username}</td>
                                <td className={userData.state === 'Alert' ? 'status-ko' : 'status-ok'}>{userData.state === 'Alert' ? '😱 DOWN 😱' : '🥳 UP 🥳'}</td>
                                <td>{new Date(userData.since).toLocaleString()}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <p>
                    Last updated at {data.lastUpdatedAt} through a {data.trigger} trigger
                </p>
            </div>
        </>
    )
}

export default App
