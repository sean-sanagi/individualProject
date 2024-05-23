import React, { useEffect, useRef, useState } from 'react';
import './TodoList.css';
const TodoList = () => {
    const [todos, setTodos] = useState([]); // Todoリストの状態を保持するuseState
    const [bgColor, setBgColor] = useState(() => {
        const savedColor = localStorage.getItem('bgColor');
        return savedColor ? JSON.parse(savedColor) : [];
    });

    useEffect(() => {
        localStorage.setItem('bgColor', JSON.stringify(bgColor));
    }, [bgColor]);

    // get index of todo list from todo databases 
    useEffect(() => {
        fetch('http://localhost:8080/').then(res => {
            res.json().then(val => {
                setTodos(val);
            })
        })
            .catch(e => {
                console.error("failed reading a url" + e);
            })
    }, [])

    // data型をフォーマットする
    const formatData = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const formattedDeadline = `${year}-${month}-${day} ${hours}:${minutes}`;
        return formattedDeadline;
    };

    // deadlineとcurrentDateを比較(差)して残日数を取得する。
    const calculateDays = (deadline) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const differenceDay = deadlineDate.getTime() - currentDate.getTime();
        const days = Math.ceil(differenceDay / (1000 * 60 * 60 * 24));
        return days;
    }

    // put data from todo database into TodoData array, the key is a index for here
    const TodoData = todos && todos.map((item, index) => {
        const formattedDeadline = formatData(item.deadline);
        const deadlineLeftDays = calculateDays(item.deadline);
        return (
            <tr key={index} className='sticky-note' style={{ backgroundColor: bgColor[index] }}>
                <th className='sticky-note-string'>タスク内容</th><td>{item.task}</td>
                <th className='sticky-note-string'>期限</th><td>{formattedDeadline}</td>
                <th className='sticky-note-string'>残日数</th><td>{deadlineLeftDays}</td>
                <td><button name='delete' onClick={() => deleteTodo(item)} className='delete-btn'>削除</button></td>
            </tr>);
    })


    // here is codes for add method 
    // I tried fetching by async await but failed

    // const add = (formData) => {
    //     async function fetchAsync() {

    //         const url = 'http://localhost:8080/add'
    //         const res = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json'
    //             },
    //             body: JSON.stringify(formData)
    //         });
    //         if (res.ok) {
    //             return fetchTodoData();
    //         } else {
    //             console.log("failed to add data");
    //         }
    //     }
    // }

    // normal fetch style
    const add = (formData) => {
        fetch('http://localhost:8080/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (res.ok) {
                    fetchTodoData();
                    alert('スケジュールが追加されました！')
                    const newBgColor = changeBgColor();
                    setBgColor([...bgColor, newBgColor]);
                } else {
                    console.error('failed adding new tasks');
                }
            })
            .catch(e => {
                console.error("エラーです" + e)
            })
    }

    // here is codes for reloading todo data 
    const fetchTodoData = () => {
        fetch('http://localhost:8080/')
            .then(res => {
                res.json()
                    .then(val => {
                        setTodos(val);
                    })
            })
            .catch(e => {
                console.error("error occur" + e);
            })
    }

    // handle events 
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newStock = {
            task: formData.get('task'),
            deadline: formData.get('deadline'),
        };
        add(newStock);

    }

    // data delete 
    const deleteTodo = (item) => {
        fetch('http://localhost:8080/delete', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(res => {
                if (res.ok) {
                    console.log(item)
                    return fetchTodoData();
                } else {
                    console.error("failed to delete")
                }
            })
            .catch(e => {
                console.error("failed to fetch" + e)
            });
    }

    // stickyNotesの背景色をランダムで取得する
    const changeBgColor = () => {
        let colors = ['#e6e6fa', '#b0c4de', '#fffacd', '#3cd371'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    //minの値を今日にする
    useEffect(() => {
    console.log("今日です")
    const today = new Date()
    // // function dateFormat(today, format) {
    // //     format = format.replace("YYYY", today.getFullYear());
    // //     format = format.replace("MM", ("0" + (today.getMonth() + 1)).slice(-2));
    // //     format = format.replace("DD", ("0" + today.getDate()).slice(-2));
    // //     return format;
    // // }
    // // const data = dateFormat(today, 'YYYY-MM-DD');
    const field = document.getElementById('deadline')
    // field.value = today; 
    field.setAttribute("min", today)
}, [])

    // here is HTML code 
    return (
        <div className='todo-app'>
            <h1>Todoアプリ</h1>
            <form onSubmit={handleSubmit} className='add-form'>
                <label className=''>
                    タスク内容
                    <textarea name='task' required className='textlines' cols="25" rows="5" placeholder='タスクの入力' />
                </label>
                <label for="deadline">
                    期限
                    <input type='datetime-local'
                        id='deadline'
                        name='deadline'
                        min={"2024-05-21T00:00"}
                        max={"2100-12-31T00:00"}
                        required>
                    </input>
                </label>
                <button type='submit'>追加</button>
            </form>
            <table className='todo-list'>
                <h2 className='todo-list'>TODO一覧</h2>
                <tbody className='sticky-notes-container'>
                    {TodoData}
                </tbody>
            </table >

        </div >
    );
}

export default TodoList;
