
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".questions-container .dropdown")
    const formLoadQuiz = document.querySelector("#form-load-quiz")
    const path = formLoadQuiz.getAttribute("data-path")
    dropdown.addEventListener("change", (e)=>{
        const quizTitle = e.target.value
        const action = path + `/${quizTitle}?_method=GET`
        // Xóa tất cả các thuộc tính selected của các option khác
        dropdown.querySelectorAll("option").forEach(option => {
            option.selected = false;
        });

        // Tìm option có value là quizTitle và thêm selected vào đó
        const optionSelected = dropdown.querySelector(`option[value='${quizTitle}']`);
        optionSelected.selected = true;

        formLoadQuiz.action = action
        formLoadQuiz.submit()
    })
    
    
});
// Hàm thêm câu trả lời

const questionContainer = document.querySelector('.questions-container');

if (questionContainer) {
    // Lấy tất cả các nút thêm câu trả lời
    const addAnswerButtons = questionContainer.querySelectorAll('.answer-content .btn-group .icon-add');

    // Lấy tất cả các câu hỏi
    const addQuestionContainers = questionContainer.querySelectorAll('.form-question-answer .questions-content');

    // Xử lý sự kiện khi nhấn nút thêm câu trả lời
    addAnswerButtons.forEach(add => {
        const formAddAnswer = document.querySelector("#form-add-answer");
        const path = formAddAnswer.getAttribute("data-path");

        add.addEventListener("click", () => {
            // Lấy câu hỏi chứa nút thêm câu trả lời
            const questionDiv = add.closest(".form-question-answer").querySelector(".questions-content");
            const indexQuestion = questionDiv ? questionDiv.dataset.index : -1; // Truyền index từ data-index của câu hỏi
            console.log(questionDiv);
            

            // Lấy câu trả lời chứa nút thêm câu trả lời
            const answerDiv = add.closest(".answer-content");
            const indexAnswer = answerDiv ? answerDiv.dataset.index : -1; // Truyền index từ data-index của câu trả lời

            // Kiểm tra lại giá trị của indexQuestion và indexAnswer
            console.log("Index của câu hỏi:", indexQuestion);
            console.log("Index của câu trả lời:", indexAnswer);

            // Lấy giá trị quizTitle từ dropdown
            const dropdown = document.querySelector(".questions-container .dropdown");
            const quizTitle = dropdown ? dropdown.value : '';

            // Cập nhật đường dẫn action của form
            const action = path + `/${quizTitle}/${indexQuestion}/${indexAnswer}?_method=POST`;

            // Cập nhật action của form (nếu cần)
            formAddAnswer.action = action;
            formAddAnswer.submit(); // Nếu sẵn sàng thực hiện gửi form
        });
    });
}






if(questionContainer){
    const addQuestion = questionContainer.querySelectorAll('.form-question-answer .questions-content .btn-add .icon-add')
    
    addQuestion.forEach(add => {
        const formAddAnswer = document.querySelector("#form-add-question")
        const path = formAddAnswer.getAttribute("data-path")
        add.addEventListener("click", ()=>{
            const indexQuestion = addQuestion.length-1
            const dropdown = document.querySelector(".questions-container .dropdown")
            const quizTitle = dropdown.value
            const action = path + `/${quizTitle}/${indexQuestion}?_method=POST`
            formAddAnswer.action = action
            formAddAnswer.submit()
        })
    })
}
  