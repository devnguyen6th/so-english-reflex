
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Target, TrendingUp, Zap } from "lucide-react";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface DifficultySelectorProps {
  onSelectDifficulty: (level: DifficultyLevel) => void;
}

const DifficultySelector = ({ onSelectDifficulty }: DifficultySelectorProps) => {
  const levels = [
    {
      id: "beginner" as DifficultyLevel,
      title: "Người Mới Bắt Đầu",
      description: "Số từ 1 đến 10",
      icon: Target,
      color: "bg-green-500",
      gradient: "from-green-400 to-emerald-500",
      examples: "1, 5, 9, 10"
    },
    {
      id: "intermediate" as DifficultyLevel,
      title: "Trung Cấp",
      description: "Số từ 1 đến 100",
      icon: TrendingUp,
      color: "bg-blue-500",
      gradient: "from-blue-400 to-cyan-500",
      examples: "23, 67, 89, 100"
    },
    {
      id: "advanced" as DifficultyLevel,
      title: "Nâng Cao",
      description: "Số lớn và phức tạp",
      icon: Zap,
      color: "bg-purple-500",
      gradient: "from-purple-400 to-pink-500",
      examples: "1,247, 50,893, 999,999"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-vietnamese">Chọn Mức Độ Khó</h2>
        <p className="text-muted-foreground">
          Bắt đầu với mức độ phù hợp với trình độ của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <Card
              key={level.id}
              className="exercise-card hover:scale-105 cursor-pointer group relative overflow-hidden"
              onClick={() => onSelectDifficulty(level.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="text-center space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full ${level.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-vietnamese">{level.title}</CardTitle>
                <CardDescription className="text-base">
                  {level.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge variant="secondary" className="level-badge">
                    Ví dụ: {level.examples}
                  </Badge>
                </div>

                <Button 
                  className="w-full group-hover:shadow-lg transition-shadow"
                  size="lg"
                >
                  Bắt Đầu Luyện Tập
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
