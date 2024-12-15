import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function ScatterPlot() {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [data, setData] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);
  const [audioElements, setAudioElements] = useState({});

  // Audio 요소들을 한 번만 생성하고 관리
  useEffect(() => {
    d3.csv("/chart_performance.csv").then((rawData) => {
      const audioMap = {};
      const processedData = rawData.map((d) => {
        const audioElement = new Audio(`/audio/${d.name}.mp3`);
        audioElement.preload = "none"; // 성능 최적화를 위해 필요할 때만 로드
        audioMap[d.name] = audioElement;

        return {
          title: d.name,
          album_cover: d.album_cover,
          album: d.album,
          danceability: parseFloat(d.danceability),
          peak_rank: parseInt(d.peak_rank, 10),
          weeks_on_chart: parseInt(d.weeks_on_chart, 10),
        };
      });

      setAudioElements(audioMap);
      setData(processedData);
    });

    // cleanup function
    return () => {
      Object.values(audioElements).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.7;
      const height = window.innerHeight * 0.7;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handlePlayPause = (song) => {
    if (playingSong && playingSong.title === song.title) {
      // 현재 재생 중인 노래를 정지
      audioElements[song.title].pause();
      audioElements[song.title].currentTime = 0;
      setPlayingSong(null);
    } else {
      // 다른 노래가 재생 중이면 정지
      if (playingSong) {
        audioElements[playingSong.title].pause();
        audioElements[playingSong.title].currentTime = 0;
      }
      // 새로운 노래 재생
      audioElements[song.title].play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
      setPlayingSong(song);
    }
  };

  useEffect(() => {
    if (!data || !dimensions.width || !dimensions.height) return;

    const margin = { top: 40, right: 40, bottom: 110, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("border", "none")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0.3, 1]).range([0, width]).nice();
    const yScale = d3.scaleLinear().domain([200, 1]).range([height, 0]).nice();
    const sizeScale = d3
      .scaleSqrt()
      .domain([1, d3.max(data, (d) => d.weeks_on_chart)])
      .range([4, 20]);

    // 축과 그리드 설정 (이전과 동일)
    const xAxis = d3.axisBottom(xScale).tickSize(-height).tickPadding(10);
    const yAxis = d3.axisLeft(yScale).tickSize(-width).tickPadding(10);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("class", "grid")
      .selectAll("line")
      .attr("stroke", "rgba(38, 33, 40, 0.13)");

    svg.selectAll(".grid path").style("display", "none");

    svg
      .append("line")
      .attr("x1", xScale(0.55)) // 시작점 x 좌표
      .attr("y1", yScale(0)) // 시작점 y 좌표
      .attr("x2", xScale(0.82)) // 끝점 x 좌표
      .attr("y2", yScale(200)) // 끝점 y 좌표
      .attr("stroke", "#4f364b")
      .attr("opacity", 0.5)
      .attr("stroke-dasharray", "2")
      .attr("stroke-width", 2);

    // 원 그리기와 이벤트 핸들링
    const circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.danceability))
      .attr("cy", (d) => yScale(d.peak_rank))
      .attr("r", (d) => sizeScale(d.weeks_on_chart) + 4)
      .attr("fill", "#db3e1d")
      .attr("opacity", 0.8)
      .attr("stroke", "black")
      .style("cursor", "pointer")
      .on("click", (event, d) => handlePlayPause(d)) // 원 클릭시 음악 재생
      .on("mouseover", function (event, d) {
        // 재생/일시정지 버튼 표시
        const button = svg
          .append("text")
          .attr("class", "play-pause-button")
          .attr("x", xScale(d.danceability))
          .attr("y", yScale(d.peak_rank) + 2)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "#f7e9de")
          .style("font-size", "16px")
          .style("pointer-events", "none") // 텍스트에 대한 마우스 이벤트 비활성화
          .text(() => (playingSong?.title === d.title ? "⏸" : "▶"));
      })
      .on("mouseout", function () {
        svg.selectAll(".play-pause-button").remove();
      });

    // 노래 제목 표시
    svg
      .selectAll("text.song-title")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "song-title")
      .attr(
        "x",
        (d) => xScale(d.danceability) + sizeScale(d.weeks_on_chart) + 9
      )
      .attr("y", (d) => yScale(d.peak_rank))
      .attr("alignment-baseline", "middle")
      .attr("fill", "rgba(38, 33, 40, 0.8)")
      .style("font-size", "12px")
      .text((d) => d.title);

    // 축 레이블
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 60)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Danceability");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Peak Chart Position (The Eras Tour period)");
  }, [data, dimensions, playingSong]);

  return (
    <div className="relative w-full h-full rounded-lg p-4">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
