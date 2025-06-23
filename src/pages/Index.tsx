
import { useState } from "react";
import Header from "@/components/Header";
import DifficultySelector, { DifficultyLevel } from "@/components/DifficultySelector";
import NumberExercise from "@/components/NumberExercise";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const handleSelectDifficulty = (level: DifficultyLevel) => {
    setSelectedDifficulty(level);
  };

  const handleBack = () => {
    setSelectedDifficulty(null);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="english-reflex-theme">
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {selectedDifficulty === null ? (
            <div className="max-w-4xl mx-auto">
              <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />
              
              {/* SEO optimized content section */}
              <div className="mt-12 text-center space-y-6">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-vietnamese mb-4">
                    Tại Sao Nên Luyện Tập Phản Xạ Đọc Số Tiếng Anh?
                  </h2>
                  <div className="text-left space-y-4 text-muted-foreground">
                    <p>
                      Khả năng đọc số tiếng Anh thành thạo là một kỹ năng quan trọng trong giao tiếp hàng ngày, 
                      đặc biệt trong công việc và học tập. Ứng dụng này giúp bạn:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Cải thiện phản xạ nghe và hiểu số tiếng Anh</li>
                      <li>Luyện tập phát âm chính xác với công nghệ text-to-speech</li>
                      <li>Tăng tự tin khi giao tiếp về số liệu trong công việc</li>
                      <li>Phát triển kỹ năng nghe tiếng Anh tự nhiên</li>
                    </ul>
                    <p>
                      Bắt đầu với mức độ phù hợp và tiến bộ từng ngày cùng các bài tập được thiết kế khoa học!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <NumberExercise difficulty={selectedDifficulty} onBack={handleBack} />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
