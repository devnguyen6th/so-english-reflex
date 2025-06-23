
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Volume2, RotateCcw, Home, CheckCircle, XCircle } from "lucide-react";
import { DifficultyLevel } from "./DifficultySelector";
import { toast } from "sonner";

interface NumberExerciseProps {
  difficulty: DifficultyLevel;
  onBack: () => void;
}

const NumberExercise = ({ difficulty, onBack }: NumberExerciseProps) => {
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [exerciseComplete, setExerciseComplete] = useState(false);

  const generateNumber = useCallback(() => {
    let min = 1, max = 10;
    
    switch (difficulty) {
      case "beginner":
        min = 1; max = 10;
        break;
      case "intermediate":
        min = 1; max = 100;
        break;
      case "advanced":
        min = 100; max = 999999;
        break;
    }
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, [difficulty]);

  const speakNumber = useCallback((number: number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(number.toString());
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const startNewRound = useCallback(() => {
    const newNumber = generateNumber();
    setCurrentNumber(newNumber);
    setTimeLeft(5);
    setIsActive(true);
    setFeedback(null);
    
    // Auto-speak the number after a short delay
    setTimeout(() => {
      speakNumber(newNumber);
    }, 500);
  }, [generateNumber, speakNumber]);

  const handleCorrect = () => {
    setScore(score + 1);
    setTotalQuestions(totalQuestions + 1);
    setIsActive(false);
    setFeedback("correct");
    
    toast.success("Chính xác! Tuyệt vời!", {
      duration: 1500,
    });

    setTimeout(() => {
      if (totalQuestions + 1 >= 10) {
        setExerciseComplete(true);
      } else {
        startNewRound();
      }
    }, 1500);
  };

  const handleIncorrect = () => {
    setTotalQuestions(totalQuestions + 1);
    setIsActive(false);
    setFeedback("incorrect");
    
    toast.error("Chưa đúng, hãy thử lại!", {
      duration: 1500,
    });

    setTimeout(() => {
      if (totalQuestions + 1 >= 10) {
        setExerciseComplete(true);
      } else {
        startNewRound();
      }
    }, 1500);
  };

  const resetExercise = () => {
    setScore(0);
    setTotalQuestions(0);
    setExerciseComplete(false);
    startNewRound();
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleIncorrect();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Start first round
  useEffect(() => {
    startNewRound();
  }, []);

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "beginner": return "Người Mới Bắt Đầu";
      case "intermediate": return "Trung Cấp";
      case "advanced": return "Nâng Cao";
    }
  };

  const getScoreColor = () => {
    const percentage = (score / Math.max(totalQuestions, 1)) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (exerciseComplete) {
    const finalScore = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="space-y-6">
        <Card className="exercise-card text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-vietnamese">Hoàn Thành Bài Tập!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl animate-bounce-in">
              {finalScore >= 80 ? "🎉" : finalScore >= 60 ? "👍" : "💪"}
            </div>
            
            <div className="space-y-2">
              <p className="text-3xl font-bold gradient-learning bg-clip-text text-transparent">
                {finalScore}%
              </p>
              <p className="text-muted-foreground">
                Bạn đã trả lời đúng {score}/{totalQuestions} câu
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetExercise} size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Thử Lại
              </Button>
              <Button variant="outline" onClick={onBack} size="lg">
                <Home className="w-4 h-4 mr-2" />
                Trang Chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <Home className="w-4 h-4 mr-2" />
          Trang Chủ
        </Button>
        <Badge variant="secondary" className="level-badge">
          {getDifficultyLabel()}
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Tiến độ: {totalQuestions}/10</span>
              <span className={getScoreColor()}>Điểm: {score}/{totalQuestions}</span>
            </div>
            <Progress value={(totalQuestions / 10) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Exercise */}
      <Card className="exercise-card">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-vietnamese">
            Số hiện tại là gì?
          </CardTitle>
          <p className="text-muted-foreground">
            Thời gian còn lại: {timeLeft}s
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Number Display */}
          <div className="text-center">
            <div className={`number-display ${feedback === "correct" ? "animate-pulse-success" : ""}`}>
              {currentNumber.toLocaleString()}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Button
              onClick={() => speakNumber(currentNumber)}
              variant="outline"
              size="lg"
              className="w-full"
              disabled={!isActive}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Nghe Lại
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleCorrect}
                disabled={!isActive}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Đúng
              </Button>
              <Button
                onClick={handleIncorrect}
                disabled={!isActive}
                variant="destructive"
                size="lg"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Sai
              </Button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center p-4 rounded-lg ${
              feedback === "correct" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            }`}>
              {feedback === "correct"
                ? "🎉 Chính xác! Bạn đã đọc đúng số này."
                : "❌ Chưa đúng. Hãy lắng nghe kỹ hơn lần sau."
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Hướng dẫn:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nhìn vào số được hiển thị</li>
              <li>Nhấn "Nghe Lại" để nghe cách phát âm</li>
              <li>Chọn "Đúng" nếu bạn đã đọc được số đó</li>
              <li>Chọn "Sai" nếu bạn chưa đọc được</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberExercise;
