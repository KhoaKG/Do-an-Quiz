document.addEventListener('DOMContentLoaded', function() {
    const addQuestionBtn = document.getElementById('add-question-btn');
    const questionsWrapper = document.getElementById('questions-wrapper');

    // Lắng nghe sự kiện click nút dấu cộng để thêm câu hỏi
    addQuestionBtn.addEventListener('click', function() {
        // Tạo form mới cho câu hỏi và câu trả lời
        const questionForm = document.createElement('div');
        questionForm.classList.add('question-form');

        // Cấu trúc form câu hỏi và câu trả lời, mặc định 4 câu trả lời
        questionForm.innerHTML = `
            <div class="form-group">
                <label>Câu hỏi:</label>
                <input type="text" class="form-control" name="questions" placeholder="Enter question" required>
            </div>
            <div class="form-group">
                <label>Câu trả lời:</label>
                <div>
                    <input type="checkbox" class="form-check-input" name="correctAnswer" value="0">
                    <input type="text" class="form-control" name="answers" placeholder="Enter answer 1" required>
                </div>
                <div>
                    <input type="checkbox" class="form-check-input" name="correctAnswer" value="1">
                    <input type="text" class="form-control" name="answers" placeholder="Enter answer 2" required>
                </div>
                <div>
                    <input type="checkbox" class="form-check-input" name="correctAnswer" value="2">
                    <input type="text" class="form-control" name="answers" placeholder="Enter answer 3" required>
                </div>
                <div>
                    <input type="checkbox" class="form-check-input" name="correctAnswer" value="3">
                    <input type="text" class="form-control" name="answers" placeholder="Enter answer 4" required>
                </div>
            </div>
        `;

        // Thêm câu hỏi form vào wrapper
        questionsWrapper.appendChild(questionForm);
    });

    // Lắng nghe sự kiện submit form
    

    
});


const formAddQuestion = document.querySelector('#form-add-question');
if(formAddQuestion){
    const buttonSubmit = formAddQuestion.querySelector(".button-submit")
    buttonSubmit.addEventListener("submit", ()=>{
        formAddQuestion.submit()
    })
}
