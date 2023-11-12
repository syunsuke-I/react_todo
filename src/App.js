import React, { useState ,useRef} from "react";

import './App.css';

function App() {

  // 編集は1つのTODOのみにするための排他フラグ
  const [isEditingExclusive, setIsEditingExclusive] = useState(false);

  const [newTodo, setNewTodo] = useState({
    index:0,
    text: "",
    isEditing: false,
    isCompleted: false
  });
  
  const [todos, setTodos] = useState([]);

  const allTodo = todos.length;
  const completedTodo = todos.filter(todo => todo.isCompleted).length;
  const incompletedTodo = allTodo - completedTodo;

  const [editingText, setEditingText] = useState("");

  const onChangeTodoText = (e) => {
    setNewTodo(prevTodo => ({
      ...prevTodo,
      text: e.target.value
    }));
  };

  const onClickAdd = () => {
    if (newTodo.text.trim() === "") {
      alert("TODOは空欄またはスペースのみでは追加できません。");
      setNewTodo(prevTodo => ({
        ...prevTodo,
        text: "",
      }));      
      return;
    }    
    const newTodoWithIndex = { ...newTodo, index: todos.length };
    const newTodos = [newTodoWithIndex, ...todos];
    setTodos(newTodos); 
    setNewTodo(prevTodo => ({
      ...prevTodo,
      text: "",
      index:prevTodo.index + 1
    }));
  };

  const onClickDel = (todoIndex) => {
    const isDelCheck = window.confirm("本当によろしいですか？");
    if (isDelCheck) {
      const newTodos = todos.filter(todo => todo.index !== todoIndex);
      setTodos(newTodos);
    }
  };

  const todoRefs = useRef({});

  const onClickEdit = (index) => {
    if (!isEditingExclusive) {
      setIsEditingExclusive(true);
      const edited_todo = todos.map((todo, idx) => {
        if (todo.index === index) {
          setEditingText(todo.text);
          todo.isEditing = true;

          // 次のレンダリングでフォーカスを当てる
          setTimeout(() => {
            if (todoRefs.current[idx]) {
              todoRefs.current[idx].focus();
            }
          }, 0);
        }
        return todo;
      });
      setTodos(edited_todo);
    } else {
      alert("他のアイテムの編集中です");
    }
  };

  const onChangeNewText = (e) => {
    setEditingText(e.target.value);
  };

  const onClickSave = (index) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.index === index) {
        todo.text = editingText;
        todo.isEditing = false;
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditingText("");
    setIsEditingExclusive(false);
  };

  const onClickDone = (index) => {
    const updatedTodos = todos.map((todo) => {
      if(todo.index === index){
        todo.isCompleted = !todo.isCompleted;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
    
  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10"> 
            <div className="flex justify-between items-center mb-4">
              <input
                className="flex-grow p-2 border rounded-md mr-2"
                placeholder="What to do next?"
                value={newTodo.text}
                onChange={onChangeTodoText}
              />
              <button onClick={onClickAdd} id="createTodoButton" className="bg-blue-500 text-white px-4 py-2 rounded-md">作成</button> 
            </div>
            <ul className="space-y-4">
              {todos.map((todo) => (
                <>
                <div className="flex" key={todo.index}>
                  <div className="flex items-center">
                      <input type="checkbox" 
                        className={`${todo.isEditing ? "hidden" : ""}`} 
                        onClick={(e) => onClickDone(todo.index)}
                        checked={todo.isCompleted}
                      />
                      {todo.isEditing ? (
                        <input
                          ref={(el) => (todoRefs.current[todo.index] = el)}
                          value={editingText}
                          onChange={onChangeNewText}
                          className="w-60 px-3 border border-blue-700"
                        />
                      ): (
                      <span className={`inline-block w-60 overflow-auto px-3 ${todo.isCompleted ? "line-through" : ""}`}>
                        {todo.text}
                      </span>
                      )}
                  </div>
                    {todo.isEditing ? (
                      <div>
                        <button className="text-blue-500 px-3" onClick={(e) => onClickSave(todo.index)}>保存</button>
                      </div>
                    ) : ( 
                      <div>
                        <button className="text-blue-500" onClick={() => onClickEdit(todo.index)}>編集</button>
                        <button className="px-3 text-red-500" onClick={() => onClickDel(todo.index)}>削除</button>
                      </div>
                    )}
                </div>
                </>
              ))}
            </ul>
      
            <div className="mt-4">
              <span id="totalTaskCount">全てのタスク：{allTodo}</span>
              <span id="completedTaskCount" className="ml-4">完了済み：{completedTodo}</span>
              <span id="incompleteTaskCount" className="ml-4">未完了：{incompletedTodo}</span>
            </div>
          </div>
        </div>
      </div>
  </>
  );
}

export default App;
