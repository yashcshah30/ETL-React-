import React, { Component } from "react";
import emailjs from 'emailjs-com';
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      todoList: [],
      name: "Yash",
      email: "yashcshah30@gmail.com"
    };
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then(res => this.setState({ todoList: res.data }))
      .catch(err => console.log(err));
  };
  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incomplete
        </span>
      </div>
    );
  };
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
            Edit{" "}
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete{" "}
          </button>
        </span>
      </li>
    ));
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  handleSubmit = item => {

    let templateParams = {
      from_name: this.state.email,
      to_name: 'yashcshah30@gmail.com',
      subject: 'To-Do',
      message: 'hardcoded message',
     }


     emailjs.send(
      'service_id',
      'template_id',
       templateParams,
      'user_id'
     );


    this.toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/todos/", item)
      .then(res => this.refreshList());
  };
  
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}`)
      .then(res => this.refreshList());
  };
  createItem = () => {
    const item = { title: "", description: "",completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  render() {
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
        <div> 
          <h1> 
            GeeksforGeeks 
          </h1> 
          <h3> 
            File Upload using React! 
          </h3> 
          <div> 
              <input type="file" onChange={this.onFileChange} /> 
              <button onClick={this.onFileUpload}> 
                Upload! 
              </button> 
          </div> 
        {this.fileData()} 
      </div> 
      </main>
    );
  }
  state = { 
    // Initially, no file is selected 
    selectedFile: null
  }; 
   
  // On file select (from the pop up) 
  onFileChange = event => { 
   
    // Update the state 
    this.setState({ selectedFile: event.target.files[0] }); 
   
  }; 
   
  // On file upload (click the upload button) 
  onFileUpload = () => { 
   
    // Create an object of formData 
    const formData = new FormData(); 
   
    // Update the formData object 
    formData.append( 
      // "myFile", 
      'file',
      this.state.selectedFile, 
      this.state.selectedFile.name 
    ); 
   
    // Details of the uploaded file 
    console.log(this.state.selectedFile); 
   
    // Request made to the backend api 
    // Send formData object 
    // axios.post("api/uploadfile", formData); 
    axios.post("http://localhost:8000/api/uploadfiles", formData,{headers: {
      'Content-Type': 'multipart/form-data'
    }
}).then(res => this.refreshList());
  }; 
  fileData = () => { 
     
    if (this.state.selectedFile) { 
        
      return ( 
        <div> 
          <h2>File Details:</h2> 
          <p>File Name: {this.state.selectedFile.name}</p> 
          <p>File Type: {this.state.selectedFile.type}</p> 
          <p> 
            Last Modified:{" "} 
            {this.state.selectedFile.lastModifiedDate.toDateString()} 
          </p> 
        </div> 
      ); 
    } else { 
      return ( 
        <div> 
          <br /> 
          <h4>Choose before Pressing the Upload button</h4> 
        </div> 
      ); 
    } 
  }; 
   
  // render() { 
     
  //   return ( 
  //     <div> 
  //         <h1> 
  //           GeeksforGeeks 
  //         </h1> 
  //         <h3> 
  //           File Upload using React! 
  //         </h3> 
  //         <div> 
  //             <input type="file" onChange={this.onFileChange} /> 
  //             <button onClick={this.onFileUpload}> 
  //               Upload! 
  //             </button> 
  //         </div> 
  //       {this.fileData()} 
  //     </div> 
  //   ); 
  // } 
}
export default App;