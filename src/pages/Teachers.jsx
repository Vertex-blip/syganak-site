import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, GraduationCap, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

const TeacherImage = ({ teacher }) => {
  if (teacher.image) {
    return <img src={teacher.image} alt={teacher.name} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-primary-dark text-4xl font-serif font-bold text-accent-gold">
      {initials(teacher.name)}
    </div>
  );
};

const Teachers = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const phdCount = institute.teachers.filter((teacher) => String(teacher.degree).includes('PhD')).length;
  const internationalCount = institute.teachers.filter((teacher) => !['Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'].includes(teacher.country)).length;

  const stats = [
    { icon: Users, value: institute.teachers.length, label: t('teachers.specialists') },
    { icon: Award, value: phdCount, label: t('teachers.phd') },
    { icon: GraduationCap, value: internationalCount, label: t('teachers.international', { defaultValue: 'International faculty' }) },
  ];
  const getTeacherBio = (teacher) =>
    teacher.bio ||
    t('teachers.bio_fallback', {
      role: teacher.role,
      degree: teacher.degree,
      country: teacher.country,
    });

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={institute.baseImages.studyGroup} alt={t('teachers.title')} className="absolute inset-0 h-full w-full object-cover opacity-28" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{institute.teacherEyebrow}</p>
          <h1 className="section-title text-white">{institute.teacherTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{institute.teacherText}</p>
          <Link to="/programs" className="btn-primary mt-8">
            {t('nav.programs')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="-mt-8 pb-8">
        <div className="container-custom relative z-20 grid gap-4 md:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="premium-panel bg-white p-6">
              <Icon className="mb-4 text-accent-gold" size={30} />
              <p className="font-serif text-4xl font-extrabold text-primary-dark">{value}</p>
              <p className="mt-2 text-sm font-bold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {institute.teacherGroups.map((group, groupIndex) => (
        <section key={group.id} className={`section-y ${groupIndex % 2 === 0 ? 'bg-background' : 'bg-white'}`}>
          <div className="container-custom">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="mb-10 max-w-3xl">
              <p className="section-eyebrow">{institute.teacherEyebrow}</p>
              <h2 className="section-title">{group.title}</h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.teachers.map((teacher, index) => (
                <motion.article
                  key={teacher.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.05 }}
                  className="premium-card group overflow-hidden"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                    <TeacherImage teacher={teacher} />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-accent-lightGold px-3 py-1 text-xs font-bold text-primary">{teacher.degree}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        <MapPin size={12} />
                        {teacher.country}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary-dark">{teacher.name}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{teacher.role}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{getTeacherBio(teacher)}</p>

                    {teacher.education?.length > 0 && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <h4 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                          <BookOpen size={14} />
                          {t('teachers.education', { defaultValue: t('about.history_title') })}
                        </h4>
                        <ul className="space-y-2">
                          {teacher.education.map((item) => (
                            <li key={item} className="text-sm leading-6 text-slate-600">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section-y bg-primary-dark text-white">
        <div className="container-custom grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="section-eyebrow">{t('nav.admission')}</p>
            <h2 className="section-title max-w-3xl text-white">{t('teachers.cta_title', { defaultValue: institute.programTitle })}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{t('teachers.cta_desc', { defaultValue: institute.aboutText })}</p>
          </div>
          <Link to="/admission" className="btn-primary">
            {t('nav.apply')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Teachers;
