package com.sims.student_management_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
        name = "results",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_result_student_examination",
                        columnNames = {
                                "student_id",
                                "examination_id"
                        }
                )
        }
)
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @NotNull(message = "Marks are required")
    @Min(value = 0, message = "Marks cannot be less than 0")
    @Max(value = 50, message = "Marks cannot be greater than 50")
    @Column(nullable = false)
    private Integer marks;

    @Column(nullable = false)
    private String resultStatus;

    @Column(nullable = false)
    private String grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "examination_id",
            nullable = false
    )
    private Examination examination;

    public Result() {
    }

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Examination getExamination() {
        return examination;
    }

    public void setExamination(Examination examination) {
        this.examination = examination;
    }
}