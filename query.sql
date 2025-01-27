SELECT d.date,
SUM(s.weekly_sales) AS total_sales,
AVG(s.weekly_sales) AS average_weekly_sales
FROM sales s 
INNER JOIN dates d  on s.date_id = d.id
WHERE d.date >= '2022-11-01' ANd d.date <= '2022-11-30'
GROUP BY d.date
ORDER BY d.date