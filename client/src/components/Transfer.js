import React from 'react'

function Transfer() {
    return (
        <div>
            <label name="recipient">Address:  </label>
            <input type="text" /><br /><br />
            <label name="tokens">Tokens:  </label>
            <input type="text" /><br /><br />
            <button>Send Tokens</button>
        </div>
    )
}

export default Transfer