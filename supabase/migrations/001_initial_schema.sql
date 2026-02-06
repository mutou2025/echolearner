-- Qwerty Learner 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 用户学习记录表
-- 记录用户在每个词库中的学习进度
-- ============================================
CREATE TABLE IF NOT EXISTS user_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dict_id TEXT NOT NULL,                    -- 词库 ID
  chapter INT NOT NULL DEFAULT 0,           -- 当前章节
  word_index INT NOT NULL DEFAULT 0,        -- 当前单词索引
  correct_count INT NOT NULL DEFAULT 0,     -- 正确次数
  wrong_count INT NOT NULL DEFAULT 0,       -- 错误次数
  last_practice_at TIMESTAMPTZ,             -- 最后练习时间
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 每个用户每个词库只有一条记录
  UNIQUE(user_id, dict_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_records_user_id ON user_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_records_dict_id ON user_records(dict_id);

-- ============================================
-- 2. 用户设置表
-- 存储用户的偏好设置
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',     -- 设置 JSON
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. 个人词库表
-- 用户上传的自定义词库
-- ============================================
CREATE TABLE IF NOT EXISTS user_dictionaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                       -- 词库名称
  description TEXT,                         -- 词库描述
  words JSONB NOT NULL DEFAULT '[]',        -- 单词列表 [{name, trans, usphone, ukphone}]
  word_count INT GENERATED ALWAYS AS (jsonb_array_length(words)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_dictionaries_user_id ON user_dictionaries(user_id);

-- ============================================
-- 4. 艾宾浩斯复习记录表
-- SM-2 算法参数存储
-- ============================================
CREATE TABLE IF NOT EXISTS review_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,                       -- 单词
  dict_id TEXT,                             -- 来源词库
  ease_factor FLOAT NOT NULL DEFAULT 2.5,   -- 简易度因子 (>=1.3)
  interval INT NOT NULL DEFAULT 1,          -- 复习间隔 (天)
  repetitions INT NOT NULL DEFAULT 0,       -- 连续正确次数
  next_review_at TIMESTAMPTZ,               -- 下次复习时间
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 每个用户每个单词只有一条记录
  UNIQUE(user_id, word)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_review_records_user_id ON review_records(user_id);
CREATE INDEX IF NOT EXISTS idx_review_records_next_review ON review_records(next_review_at);

-- ============================================
-- 5. 错题记录表
-- 记录用户的错误单词
-- ============================================
CREATE TABLE IF NOT EXISTS error_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,                       -- 单词
  dict_id TEXT,                             -- 来源词库
  wrong_count INT NOT NULL DEFAULT 1,       -- 错误次数
  last_wrong_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, word)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_error_words_user_id ON error_words(user_id);

-- ============================================
-- 6. 学习统计表
-- 每日学习统计汇总
-- ============================================
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,                       -- 日期
  words_practiced INT NOT NULL DEFAULT 0,   -- 练习单词数
  correct_count INT NOT NULL DEFAULT 0,     -- 正确次数
  wrong_count INT NOT NULL DEFAULT 0,       -- 错误次数
  practice_time INT NOT NULL DEFAULT 0,     -- 练习时长 (秒)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- ============================================
-- 自动更新 updated_at 触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为各表添加触发器
CREATE TRIGGER update_user_records_updated_at
  BEFORE UPDATE ON user_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_dictionaries_updated_at
  BEFORE UPDATE ON user_dictionaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_records_updated_at
  BEFORE UPDATE ON review_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON daily_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 策略
-- 确保用户只能访问自己的数据
-- ============================================

-- 启用 RLS
ALTER TABLE user_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dictionaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- user_records 策略
CREATE POLICY "Users can view own records" ON user_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON user_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON user_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON user_records
  FOR DELETE USING (auth.uid() = user_id);

-- user_settings 策略
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- user_dictionaries 策略
CREATE POLICY "Users can view own dictionaries" ON user_dictionaries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dictionaries" ON user_dictionaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dictionaries" ON user_dictionaries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dictionaries" ON user_dictionaries
  FOR DELETE USING (auth.uid() = user_id);

-- review_records 策略
CREATE POLICY "Users can view own reviews" ON review_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON review_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON review_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON review_records
  FOR DELETE USING (auth.uid() = user_id);

-- error_words 策略
CREATE POLICY "Users can view own errors" ON error_words
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own errors" ON error_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own errors" ON error_words
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own errors" ON error_words
  FOR DELETE USING (auth.uid() = user_id);

-- daily_stats 策略
CREATE POLICY "Users can view own stats" ON daily_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON daily_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON daily_stats
  FOR UPDATE USING (auth.uid() = user_id);
