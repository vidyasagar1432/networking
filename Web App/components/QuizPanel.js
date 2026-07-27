import { ref, computed } from 'vue';

export default {
    name: "QuizPanel",
    template: `
    <div class="inspector flex flex-col h-full bg-slate-900 border-l border-slate-700 shadow-2xl">
        <div class="panel-header bg-amber-900/30 border-b border-amber-500/30 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <i class="fas fa-lightbulb text-amber-400"></i>
                <span class="text-sm font-bold text-amber-100">Knowledge Check</span>
            </div>
            <span class="text-xs font-mono text-amber-400/70">Score: {{ score }} / {{ totalQuestions }}</span>
        </div>
        <div class="panel-content flex flex-col">
            <div class="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
                <div class="bg-amber-500 h-full transition-all duration-500" :style="{ width: progress + '%' }"></div>
            </div>
            <div v-if="currentQuestion" class="flex-1">
                <h3 class="text-lg font-bold text-white mb-4">{{ currentQuestion.text }}</h3>
                <div v-if="currentQuestion.type === 'mcq'" class="space-y-3">
                    <button v-for="(option, idx) in currentQuestion.options" :key="idx"
                        @click="submitAnswer(option)" :disabled="showFeedback"
                        :class="getOptionClass(option)"
                        class="w-full text-left p-3 rounded-lg border text-sm transition-all duration-200 flex justify-between items-center">
                        <span>{{ option }}</span>
                        <i v-if="showFeedback && isCorrect(option)" class="fas fa-check-circle text-green-500"></i>
                        <i v-else-if="showFeedback && !isCorrect(option)" class="fas fa-times-circle text-red-500"></i>
                    </button>
                </div>
                <div v-else-if="currentQuestion.type === 'tf'" class="flex gap-4">
                    <button @click="submitAnswer('True')" :disabled="showFeedback" :class="getOptionClass('True')" class="flex-1 py-3 rounded-lg border text-sm transition-all">True</button>
                    <button @click="submitAnswer('False')" :disabled="showFeedback" :class="getOptionClass('False')" class="flex-1 py-3 rounded-lg border text-sm transition-all">False</button>
                </div>
            </div>
            <div v-if="showFeedback" class="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-600">
                <div class="flex items-center gap-2 mb-2" :class="isCorrect(selectedAnswer) ? 'text-green-400' : 'text-red-400'">
                    <i :class="isCorrect(selectedAnswer) ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
                    <span class="font-bold uppercase text-xs tracking-widest">{{ isCorrect(selectedAnswer) ? 'Correct!' : 'Incorrect' }}</span>
                </div>
                <p class="text-sm text-slate-300 leading-relaxed mb-3">{{ currentQuestion.explanation }}</p>
                <button @click="nextQuestion" class="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs transition-colors">Next Question</button>
            </div>
            <div v-if="isFinished" class="text-center py-10">
                <i class="fas fa-trophy text-5xl text-amber-500 mb-4"></i>
                <h3 class="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                <p class="text-slate-400 mb-6">You scored {{ score }} out of {{ totalQuestions }}</p>
                <button @click="resetQuiz" class="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold">Restart Quiz</button>
            </div>
        </div>
    </div>
    `,
    setup() {
        const questions = [
            { text: "Which field in the Ethernet header determines if a frame should be processed by the node?", type: "mcq", options: ["Source MAC", "Destination MAC", "EtherType", "Payload"], answer: "Destination MAC", explanation: "The Destination MAC address tells the switch or host whether the frame is intended for them, a multicast group, or a broadcast." },
            { text: "ARP is a Layer 3 protocol.", type: "tf", options: ["True", "False"], answer: "False", explanation: "ARP operates at Layer 2 (Data Link) to map Layer 3 IP addresses to Layer 2 MAC addresses." },
            { text: "What is the broadcast MAC address used in ARP requests?", type: "mcq", options: ["00:00:00:00:00:00", "FF:FF:FF:FF:FF:FF", "01:00:5E:00:00:01", "FF:00:00:00:00:00"], answer: "FF:FF:FF:FF:FF:FF", explanation: "ARP requests use the broadcast MAC FF:FF:FF:FF:FF:FF so all devices on the segment process the frame." },
            { text: "ARP cache entries are permanent.", type: "tf", options: ["True", "False"], answer: "False", explanation: "ARP cache entries are temporary and age out after a timeout period (typically 2-4 minutes for incomplete, 20 minutes for complete)." },
            { text: "What does ARP stand for?", type: "mcq", options: ["Address Resolution Protocol", "Advanced Routing Protocol", "Automated Response Process", "Address Recognition Protocol"], answer: "Address Resolution Protocol", explanation: "ARP stands for Address Resolution Protocol. It resolves IP addresses to MAC addresses." }
        ];
        const score = ref(0);
        const totalQuestions = ref(questions.length);
        const currentQuestionIdx = ref(0);
        const showFeedback = ref(false);
        const isFinished = ref(false);
        const selectedAnswer = ref(null);
        const currentQuestion = computed(() => questions[currentQuestionIdx.value]);
        const progress = computed(() => (currentQuestionIdx.value / questions.length) * 100);
        const isCorrect = (option) => option === currentQuestion.value.answer;
        const submitAnswer = (option) => {
            selectedAnswer.value = option;
            if (isCorrect(option)) score.value++;
            showFeedback.value = true;
        };
        const nextQuestion = () => {
            if (currentQuestionIdx.value < questions.length - 1) {
                currentQuestionIdx.value++;
                showFeedback.value = false;
                selectedAnswer.value = null;
            } else {
                isFinished.value = true;
            }
        };
        const resetQuiz = () => {
            score.value = 0;
            currentQuestionIdx.value = 0;
            showFeedback.value = false;
            isFinished.value = false;
            selectedAnswer.value = null;
        };
        const getOptionClass = (option) => {
            if (!showFeedback.value) return "bg-slate-800 border-slate-700 hover:border-sky-500 hover:bg-slate-700 text-slate-300";
            if (isCorrect(option)) return "bg-green-900/20 border-green-500 text-green-400";
            if (option === selectedAnswer.value) return "bg-red-900/20 border-red-500 text-red-400";
            return "bg-slate-800 border-slate-700 text-slate-500 opacity-50";
        };
        return { score, totalQuestions, currentQuestion, progress, showFeedback, isFinished, selectedAnswer, isCorrect, submitAnswer, nextQuestion, resetQuiz, getOptionClass };
    }
};
