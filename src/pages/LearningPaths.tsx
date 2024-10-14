import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Map, Award, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

const LearningPaths: React.FC = () => {
  const [userSkills, setUserSkills] = useState({});
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    // Simulated API calls
    setUserSkills({
      'JavaScript': 60,
      'React': 40,
      'Node.js': 30,
      'Python': 20,
    });

    setLearningPaths([
      { id: 1, name: 'Frontend Developer', progress: 45, courses: ['HTML & CSS Basics', 'JavaScript Fundamentals', 'React Essentials'] },
      { id: 2, name: 'Backend Developer', progress: 30, courses: ['Node.js Basics', 'Express.js', 'Database Design'] },
      { id: 3, name: 'Full Stack Developer', progress: 20, courses: ['Frontend Basics', 'Backend Basics', 'Full Stack Projects'] },
    ]);
  }, []);

  useEffect(() => {
    if (selectedPath) {
      renderRoadmap();
    }
  }, [selectedPath]);

  const renderRoadmap = () => {
    const svg = d3.select("#roadmap");
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3.scaleLinear().domain([0, selectedPath.courses.length - 1]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(selectedPath.courses.length));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll("circle")
      .data(selectedPath.courses)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => x(i))
      .attr("cy", (d, i) => y(Math.random() * 100))
      .attr("r", 5)
      .attr("fill", "steelblue");

    svg.selectAll("text")
      .data(selectedPath.courses)
      .enter()
      .append("text")
      .attr("x", (d, i) => x(i))
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text(d => d)
      .attr("font-size", "10px");
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Learning Paths</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-6 w-6" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Your Skills</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(userSkills).map(([skill, level]) => (
              <div key={skill}>
                <p className="font-medium">{skill}</p>
                <Progress value={level} className="w-full" />
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-4">Available Learning Paths</h3>
          <div className="space-y-4">
            {learningPaths.map(path => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="neumorphic-card cursor-pointer" onClick={() => setSelectedPath(path)}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h4 className="font-semibold">{path.name}</h4>
                      <Progress value={path.progress} className="w-full mt-2" />
                    </div>
                    <Button variant="outline">
                      {selectedPath?.id === path.id ? 'Selected' : 'Select'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedPath && (
        <Card className="neumorphic-card">
          <CardHeader>
            <CardTitle>{selectedPath.name} Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <svg id="roadmap" width="600" height="400"></svg>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Courses in this path:</h4>
              <ul className="list-disc list-inside">
                {selectedPath.courses.map((course, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningPaths;